using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Transaction;

public record SendMoneyRequestDto(
    [Required(ErrorMessage = "El número de teléfono del destinatario es requerido.")]
    [Phone]
    string RecipientPhoneNumber,

    [Required]
    [Range(0.01, 10000, ErrorMessage = "El monto debe estar entre 0.01 y 10,000.")]
    decimal Amount,
    
    [MaxLength(100)]
    string? Description
);