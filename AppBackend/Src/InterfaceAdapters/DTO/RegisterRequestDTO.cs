using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Auth;

public record RegisterUserRequestDto(
    [Required(ErrorMessage = "El nombre completo es requerido.")]
    [StringLength(150, MinimumLength = 3)]
    string FullName,

    [Required]
    [Phone]
    string PhoneNumber,
    
    [EmailAddress]
    [MaxLength(100)]
    string? Email,

    [Required]
    [StringLength(6, MinimumLength = 6)]
    [RegularExpression("^[0-9]*$")]
    string Pin,

    [Required]
    string OtpCode
);