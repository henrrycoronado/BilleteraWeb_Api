using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public enum UserStatus
{
    PendingVerification,
    Active,
    Blocked,
    Inactive
}

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string FullName { get; set; }

    [Required]
    [MaxLength(25)]
    public string PhoneNumber { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    [Required]
    public string PinHash { get; set; }

    [Required]
    public UserStatus Status { get; set; } = UserStatus.PendingVerification;

    // Relaciones de navegación
    public Wallet Wallet { get; set; }
    public ICollection<PaymentMethod> PaymentMethods { get; set; } = new List<PaymentMethod>();
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}