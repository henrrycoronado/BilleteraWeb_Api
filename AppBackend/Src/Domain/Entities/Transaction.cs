using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public enum TransactionType { P2P_TRANSFER, RELOAD_FROM_PAYMENT_METHOD, QR_PAYMENT_SENT, QR_PAYMENT_RECEIVED, BILL_PAYMENT }
public enum TransactionStatus { PENDING, AWAITING_OTP, COMPLETED, FAILED, REVERSED }

public class Transaction
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public int? SourceWalletId { get; set; }
    public int? DestinationWalletId { get; set; }
    public int? PaymentMethodId { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 4)")]
    public decimal Amount { get; set; }

    [Required]
    public TransactionType Type { get; set; }
    
    [Required]
    public TransactionStatus Status { get; set; } = TransactionStatus.PENDING;

    [MaxLength(255)]
    public string? Description { get; set; }
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    // Relaciones de navegación
    [ForeignKey("SourceWalletId")]
    public Wallet? SourceWallet { get; set; }
    
    [ForeignKey("DestinationWalletId")]
    public Wallet? DestinationWallet { get; set; }
    
    [ForeignKey("PaymentMethodId")]
    public PaymentMethod? PaymentMethod { get; set; }
}