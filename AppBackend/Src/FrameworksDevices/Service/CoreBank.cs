using Application.DTO;
using Application.Interfaces;

namespace FrameworksDevices.Services;

public static class CoreBank
{
    public static Task<PaymentGatewayResponse> ProcessChargeAsync(string paymentMethodToken, decimal amount)
    {
        bool isSuccess = new Random().Next(0, 10) < 8; 

        if (isSuccess)
        {
            var gatewayTransactionId = "sim_txn_" + Guid.NewGuid().ToString();
            var response = new PaymentGatewayResponse(true, gatewayTransactionId, null);
            return Task.FromResult(response);
        }
        else
        {
            var response = new PaymentGatewayResponse(false, null, "Fondos insuficientes en su cuenta bancaria.");
            return Task.FromResult(response);
        }
    }
}