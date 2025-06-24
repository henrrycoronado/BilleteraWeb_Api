using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public enum PaymentMethodType { CREDIT_CARD, DEBIT_CARD, BANK_ACCOUNT }

public class PaymentMethod
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User User { get; set; }
    
    [Required]
    public PaymentMethodType Type { get; set; }

    [Required]
    [MaxLength(50)]
    public string Provider { get; set; }

    [Required]
    public string Token { get; set; }

    [Required]
    [MaxLength(50)]
    public string MaskedIdentifier { get; set; }
    
    public bool IsDefault { get; set; } = false;
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}