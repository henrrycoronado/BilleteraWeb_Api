using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public enum OtpType { REGISTRATION, PIN_RECOVERY, TRANSACTION_CONFIRMATION }

public class Otp
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(25)]
    public string PhoneNumber { get; set; }

    [Required]
    public string CodeHash { get; set; }

    [Required]
    public OtpType Type { get; set; }

    [Required]
    public DateTime ExpiresAt { get; set; }

    public bool IsUsed { get; set; } = false;
    public int Attempts { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}