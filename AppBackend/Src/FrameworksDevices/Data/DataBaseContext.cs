using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FrameworksDevices.Data;

public class WalletDbContext : DbContext
{
    public WalletDbContext(DbContextOptions<WalletDbContext> options) : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<Otp> Otps { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresEnum<UserStatus>();
        modelBuilder.HasPostgresEnum<TransactionType>();
        modelBuilder.HasPostgresEnum<TransactionStatus>();
        modelBuilder.HasPostgresEnum<PaymentMethodType>();
        modelBuilder.HasPostgresEnum<OtpType>();

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.PhoneNumber).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();

            entity.HasOne(u => u.Wallet)
                .WithOne(w => w.User)
                .HasForeignKey<Wallet>(w => w.UserId)
                .IsRequired();
        });

        modelBuilder.Entity<Wallet>(entity =>
        {
            entity.Property(w => w.Balance).HasColumnType("decimal(18, 4)");
            
            entity.HasMany(w => w.SentTransactions)
                .WithOne(t => t.SourceWallet)
                .HasForeignKey(t => t.SourceWalletId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(w => w.ReceivedTransactions)
                .WithOne(t => t.DestinationWallet)
                .HasForeignKey(t => t.DestinationWalletId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.Amount).HasColumnType("decimal(18, 4)");

            entity.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");
        });
    }
}