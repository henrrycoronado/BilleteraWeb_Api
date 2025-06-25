using Domain.Entities;
using Application.DTO;

namespace Application.Interfaces;

public interface IUserService
{
    Task ChangePinAsync(int userId, string currentPin, string newPin);
}