namespace Application.DTO;

public record PaymentMethodDto(
    int Id,
    string Type,
    string Provider, 
    string MaskedIdentifier, 
    bool IsDefault
);