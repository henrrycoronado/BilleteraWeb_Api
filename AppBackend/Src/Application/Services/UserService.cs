using Application.DTO;
using Application.Interfaces;
using Domain.Entities;
using Domain.Repository;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task ChangePinAsync(int userId, string currentPin, string newPin)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("Usuario no encontrado.");
        }

        if (!_passwordHasher.Verify(currentPin, user.PinHash))
        {
            throw new Exception("El PIN actual es incorrecto.");
        }

        user.PinHash = _passwordHasher.Hash(newPin);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }
}