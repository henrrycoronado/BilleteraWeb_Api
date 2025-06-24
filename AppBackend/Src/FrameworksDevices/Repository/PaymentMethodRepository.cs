using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Data;

namespace FrameworksDevices.Repository;

public class PaymentMethodRepository : GenericRepository<PaymentMethod>, IPaymentMethodRepository
{
    public PaymentMethodRepository(WalletDbContext context) : base(context)
    {
    }
}