using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Auth;

public record LoginRequestDto(
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [Phone]
    string PhoneNumber,

    [Required(ErrorMessage = "El PIN es requerido.")]
    string Pin
);