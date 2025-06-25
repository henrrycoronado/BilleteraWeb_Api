using Application.DTO;
using Application.Interfaces;
using Domain.Entities;
using Domain.Repository;
using Application.Utils;

namespace Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<string> RequestRegistrationOtpAsync(string phoneNumber)
    {
        var existingUser = await _unitOfWork.Users.GetByPhoneNumberAsync(phoneNumber);
        if (existingUser != null)
        {
            throw new Exception($"El número de teléfono '{phoneNumber}' ya está en uso.");
        }

        var otpCode = OtpGenerator.Generate();
        var otpHash = _passwordHasher.Hash(otpCode);
        var otpEntity = new Otp
        {
            PhoneNumber = phoneNumber,
            CodeHash = otpHash,
            Type = OtpType.REGISTRATION,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5)
        };
        await _unitOfWork.Otps.AddAsync(otpEntity);
        await _unitOfWork.SaveChangesAsync();
        return otpCode;
    }

    public async Task<UserDto> RegisterUserAsync(string fullName, string phoneNumber, string? email, string pin, string otpCode)
    {
        var otpEntity = await _unitOfWork.Otps.FindValidOtpAsync(phoneNumber, OtpType.REGISTRATION);
        if (otpEntity == null)
        {
            throw new Exception("No se encontró un OTP válido para este número. Por favor, solicita uno nuevo.");
        }
        if (!_passwordHasher.Verify(otpCode, otpEntity.CodeHash))
        {
            throw new Exception("El código OTP es incorrecto.");
        }
        otpEntity.IsUsed = true;
        _unitOfWork.Otps.Update(otpEntity);
        var existingUser = await _unitOfWork.Users.GetByPhoneNumberAsync(phoneNumber);
        if (existingUser != null)
        {
            throw new Exception("Este número de teléfono ya esta registrado en el sistema.");
        }

        var pinHash = _passwordHasher.Hash(pin);
        var newUser = new User
        {
            FullName = fullName,
            PhoneNumber = phoneNumber,
            Email = email,
            PinHash = pinHash,
            Status = UserStatus.Active
        };
        newUser.Wallet = new Wallet();

        await _unitOfWork.Users.AddAsync(newUser);
        await _unitOfWork.SaveChangesAsync();
        return new UserDto(
            newUser.Id,
            newUser.FullName,
            newUser.PhoneNumber,
            newUser.Email,
            newUser.Status.ToString()
        );
    }

    public async Task<AuthResponseDto> LoginAsync(string phoneNumber, string pin){
        var user = await _unitOfWork.Users.GetByPhoneNumberAsync(phoneNumber);
        if (user == null)
        {
            throw new Exception("Credenciales inválidas.");
        }
        if (!_passwordHasher.Verify(pin, user.PinHash))
        {
            throw new Exception("Credenciales inválidas.");
        }
        if (user.Status != UserStatus.Active)
        {
            throw new Exception($"El estado de la cuenta es '{user.Status}'. No se puede iniciar sesión.");
        }

        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Status.ToString())
        };
        
        var sessionToken = _tokenGenerator.Generate(claims, TimeSpan.FromHours(8));
        var userDto = new UserDto(user.Id, user.FullName, user.PhoneNumber, user.Email, user.Status.ToString());

        return new AuthResponseDto(userDto, sessionToken);
    }
}