namespace Application.DTO;

public record TransactionDto(
    Guid Id,
    string Type,
    string Status,
    decimal Amount,
    string? Description,
    DateTime Timestamp,
    int? SourceWalletId,
    int? DestinationWalletId
);