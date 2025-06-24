using Domain.Entities;

namespace Domain.Repository;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByPhoneNumberAsync(string phoneNumber);
    Task<User?> GetByEmailAsync(string email);
}