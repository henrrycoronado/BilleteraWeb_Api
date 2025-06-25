using System.ComponentModel.DataAnnotations;
namespace InterfaceAdapters.DTO.Auth;

public record RequestOtpRequestDto(
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [Phone(ErrorMessage = "El formato del número de teléfono no es válido.")]
    string PhoneNumber
);