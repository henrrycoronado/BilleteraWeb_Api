using Domain.Repository;
using FrameworksDevices.Data;

namespace FrameworksDevices.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly WalletDbContext _context;
    public UnitOfWork(WalletDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Wallets = new WalletRepository(_context);
        Transactions = new TransactionRepository(_context);
        PaymentMethods = new PaymentMethodRepository(_context);
        Otps = new OtpRepository(_context);
    }
    public IUserRepository Users { get; private set; }
    public IWalletRepository Wallets { get; private set; }
    public ITransactionRepository Transactions { get; private set; }
    public IPaymentMethodRepository PaymentMethods { get; private set; }
    public IOtpRepository Otps { get; private set; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}