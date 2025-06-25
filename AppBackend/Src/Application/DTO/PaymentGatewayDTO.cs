namespace Application.DTO;

public record PaymentGatewayResponse(
    bool IsSuccess,
    string? TransactionId,
    string? ErrorMessage
);