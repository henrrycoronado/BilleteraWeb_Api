using Application.DTO;
using Application.Interfaces;
using Domain.Entities;
using Domain.Repository;
using FrameworksDevices.Services;

namespace Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    public PaymentService(IUnitOfWork unitOfWork){
        _unitOfWork = unitOfWork; 
    }

    public async Task<PaymentMethodDto> AddPaymentMethodAsync(int userId, PaymentMethodType type, string provider, string token, string maskedIdentifier)
    {
        var newMethod = new PaymentMethod
        {
            UserId = userId,
            Type = type,
            Provider = provider,
            Token = token,
            MaskedIdentifier = maskedIdentifier
        };

        await _unitOfWork.PaymentMethods.AddAsync(newMethod);
        await _unitOfWork.SaveChangesAsync();

        return new PaymentMethodDto(newMethod.Id, newMethod.Type.ToString(), newMethod.Provider, newMethod.MaskedIdentifier, newMethod.IsDefault);
    }
    
    public async Task<IEnumerable<PaymentMethodDto>> GetPaymentMethodsByUserIdAsync(int userId)
    {
        var methods = await _unitOfWork.PaymentMethods.FindAsync(pm => pm.UserId == userId);
        return methods.Select(pm => new PaymentMethodDto(pm.Id, pm.Type.ToString(), pm.Provider, pm.MaskedIdentifier, pm.IsDefault));
    }
    public async Task<PaymentGatewayResponse> AddMoney(int userId, int paymentMethodId, decimal amount){
        if (amount <= 0) throw new ArgumentException("El monto de la recarga debe ser positivo.");

        var paymentMethod = await _unitOfWork.PaymentMethods.GetByIdAsync(paymentMethodId);
        var wallet = (await _unitOfWork.Wallets.FindAsync(w => w.UserId == userId)).First();

        if (paymentMethod == null || paymentMethod.UserId != userId)
        {
            throw new KeyNotFoundException("El método de pago no es válido o no pertenece al usuario.");
        }

        var chargeResponse = await CoreBank.ProcessChargeAsync(paymentMethod.Token, amount);
        
        if (!chargeResponse.IsSuccess)
        {
            throw new Exception($"La recarga falló. Motivo del proveedor: {chargeResponse.ErrorMessage}");
        }

        wallet.Balance += amount;
        _unitOfWork.Wallets.Update(wallet);

        var transaction = new Transaction
        {
            Amount = amount,
            DestinationWalletId = wallet.Id,
            PaymentMethodId = paymentMethod.Id,
            Status = TransactionStatus.COMPLETED,
            Type = TransactionType.RELOAD_FROM_PAYMENT_METHOD,
            Description = $"Recarga desde {paymentMethod.MaskedIdentifier}"
        };
        await _unitOfWork.Transactions.AddAsync(transaction);

        await _unitOfWork.SaveChangesAsync();
        
        return new PaymentGatewayResponse(
            chargeResponse.IsSuccess,
            chargeResponse.TransactionId,
            chargeResponse.ErrorMessage
        );
    }
}