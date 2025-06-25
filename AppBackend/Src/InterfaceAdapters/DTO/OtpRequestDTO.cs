using System.ComponentModel.DataAnnotations;
namespace InterfaceAdapters.DTO.Auth;

public record RequestOtpRequestDto(
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [StringLength(8, MinimumLength = 8)]
    [RegularExpression("^[0-9]*$")]
    string PhoneNumber
);