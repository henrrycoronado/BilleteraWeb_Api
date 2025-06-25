using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Data;
using Microsoft.EntityFrameworkCore;

namespace FrameworksDevices.Repository;
public class TransactionRepository : GenericRepository<Transaction>, ITransactionRepository
{
    public TransactionRepository(WalletDbContext context) : base(context) { }

    public async Task<IEnumerable<Transaction>> GetHistoryByWalletIdAsync(int walletId)
    {
        return await _context.Transactions
            .Where(t => t.SourceWalletId == walletId || t.DestinationWalletId == walletId)
            .OrderByDescending(t => t.Timestamp)
            .ToListAsync();
    }
}