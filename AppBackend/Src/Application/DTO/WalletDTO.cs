namespace Application.DTO;

public record WalletDto(
    int Id,
    decimal Balance,
    string Currency
);