using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Data;
using Microsoft.EntityFrameworkCore;

namespace FrameworksDevices.Repository;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    public UserRepository(WalletDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByPhoneNumberAsync(string phoneNumber)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }
}