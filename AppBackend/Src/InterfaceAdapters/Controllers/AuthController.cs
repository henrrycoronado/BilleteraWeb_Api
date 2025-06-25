using Application.Interfaces;
using InterfaceAdapters.DTO.Auth;
using Microsoft.AspNetCore.Mvc;

namespace InterfaceAdapters.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("request-otp")]
    public async Task<IActionResult> RequestRegistrationOtp([FromBody] RequestOtpRequestDto request)
    {
        try
        {
            var otp = await _authService.RequestRegistrationOtpAsync(request.PhoneNumber);
            return Ok(new { message = "OTP generado para simulación.", otpCode = otp });
        }
        catch (Exception ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequestDto request)
    {
        try
        {
            var userDto = await _authService.RegisterUserAsync(
                request.FullName,
                request.PhoneNumber,
                request.Email,
                request.Pin,
                request.OtpCode
            );
            return StatusCode(201, new { message = "Usuario registrado exitosamente.", user = userDto });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var authResponse = await _authService.LoginAsync(request.PhoneNumber, request.Pin);
            return Ok(new 
            { 
                message = "Inicio de sesión exitoso",
                user = authResponse.User,
                token = authResponse.Token
            });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}