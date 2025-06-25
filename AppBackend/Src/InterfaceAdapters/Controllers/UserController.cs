using Application.Interfaces;
using InterfaceAdapters.DTO.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims; 

namespace InterfaceAdapters.Controllers;

[ApiController]
[Route("/user")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IAuthService authService, IUserService userService)
    {
        _userService = userService;
    }

    [HttpPut("change-pin")]
    [Authorize]
    public async Task<IActionResult> ChangePin([FromBody] ChangePinRequestDto request)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue("id"));
            await _userService.ChangePinAsync(userId, request.CurrentPin, request.NewPin);
            return Ok(new { message = "PIN actualizado exitosamente." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}