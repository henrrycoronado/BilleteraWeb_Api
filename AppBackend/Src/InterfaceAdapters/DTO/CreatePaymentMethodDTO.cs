using Domain.Entities; 
using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Payment;

public record CreatePaymentMethodDto(
    [Required]
    PaymentMethodType Type,

    [Required]
    string Provider,

    [Required]
    string Token,

    [Required]
    string MaskedIdentifier
);