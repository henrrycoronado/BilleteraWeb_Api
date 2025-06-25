using Domain.Entities;
using Application.DTO;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<string> RequestRegistrationOtpAsync(string phoneNumber);
    Task<UserDto> RegisterUserAsync(string fullName, string phoneNumber, string? email, string pin, string otpCode);
    Task<AuthResponseDto> LoginAsync(string phoneNumber, string pin);
}