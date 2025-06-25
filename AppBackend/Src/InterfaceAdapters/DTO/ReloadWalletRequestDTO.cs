using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Payment;

public record ReloadWalletRequestDto(
    [Required]
    int PaymentMethodId,

    [Required]
    [Range(1, 10000)]
    decimal Amount
);