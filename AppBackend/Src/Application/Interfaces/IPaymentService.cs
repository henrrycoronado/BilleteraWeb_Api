using Application.DTO;
using Domain.Entities;

namespace Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, PaymentMethodType type, string provider, string token, string maskedIdentifier);
    Task<IEnumerable<PaymentMethodDto>> GetPaymentMethodsByUserIdAsync(int userId);
    Task<PaymentGatewayResponse> AddMoney(int userId, int paymentMethodId, decimal amount);
}
