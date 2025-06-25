namespace Domain.Repository;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IWalletRepository Wallets { get; }
    ITransactionRepository Transactions { get; }
    IPaymentMethodRepository PaymentMethods { get; }
    IOtpRepository Otps { get; }
    Task<int> SaveChangesAsync();
}