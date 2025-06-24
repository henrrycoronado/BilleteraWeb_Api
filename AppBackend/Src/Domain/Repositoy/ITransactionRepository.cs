using Domain.Entities;

namespace Domain.Repository;

public interface ITransactionRepository : IGenericRepository<Transaction>
{
    Task<IEnumerable<Transaction>> GetHistoryByWalletIdAsync(int walletId);
}