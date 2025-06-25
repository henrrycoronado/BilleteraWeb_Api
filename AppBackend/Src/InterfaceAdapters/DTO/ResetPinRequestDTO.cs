using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Auth;

public record ResetPinRequestDto(
    [Required, Phone]
    string PhoneNumber,

    [Required]
    string OtpCode,

    [Required, StringLength(6, MinimumLength = 6)]
    string NewPin
);