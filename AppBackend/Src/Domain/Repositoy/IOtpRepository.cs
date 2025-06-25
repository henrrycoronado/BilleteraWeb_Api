using Domain.Entities;

namespace Domain.Repository;

public interface IOtpRepository : IGenericRepository<Otp>
{
    Task<Otp?> FindValidOtpAsync(string phoneNumber, OtpType type);
}