using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Data;
using Microsoft.EntityFrameworkCore;

namespace FrameworksDevices.Repository;

public class OtpRepository : GenericRepository<Otp>, IOtpRepository
{
    public OtpRepository(WalletDbContext context) : base(context)
    {
    }

    public async Task<Otp?> FindValidOtpAsync(string phoneNumber, OtpType type)
    {
        return await _context.Otps
            .Where(o => o.PhoneNumber == phoneNumber &&
                        o.Type == type &&
                        o.IsUsed == false &&
                        o.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(o => o.CreatedAt)
            .FirstOrDefaultAsync();
    }
}