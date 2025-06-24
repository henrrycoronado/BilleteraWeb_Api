// FrameworksDevices/Repository/WalletRepository.cs
using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Data;

namespace FrameworksDevices.Repository;
public class WalletRepository : GenericRepository<Wallet>, IWalletRepository
{
    public WalletRepository(WalletDbContext context) : base(context) { }
}
