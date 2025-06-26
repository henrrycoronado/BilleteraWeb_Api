using System.ComponentModel.DataAnnotations;
namespace InterfaceAdapters.DTO.Auth;

public record RequestOtpRequestDto(
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [StringLength(8, MinimumLength = 8)]
    [RegularExpression("^[0-9]*$")]
    string PhoneNumber,
    string? Email
);

public record RequestOtpValidateDto(
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [StringLength(8, MinimumLength = 8)]
    [RegularExpression("^[0-9]*$")]
    string PhoneNumber,

    [Required(ErrorMessage = "El número otp es requerido.")]
    [StringLength(6, MinimumLength = 6)]
    [RegularExpression("^[0-9]*$")]
    string OtpCode
);