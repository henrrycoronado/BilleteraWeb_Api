using System.ComponentModel.DataAnnotations;

namespace InterfaceAdapters.DTO.Auth;

public record ChangePinRequestDto(
    [Required]
    string CurrentPin,

    [Required]
    [StringLength(6, MinimumLength = 6)]
    [RegularExpression("^[0-9]*$")]
    string NewPin
);