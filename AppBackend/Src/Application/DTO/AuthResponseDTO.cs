namespace Application.DTO;

public record AuthResponseDto(
    UserDto User,
    string Token
);