namespace Application.DTO;
public record UserDto(
    int Id,
    string FullName,
    string PhoneNumber,
    string? Email,
    string Status
);