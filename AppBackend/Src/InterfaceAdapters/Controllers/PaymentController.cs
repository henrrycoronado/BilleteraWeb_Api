using Application.Interfaces;
using InterfaceAdapters.DTO.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InterfaceAdapters.Controllers;

[ApiController]
[Route("/payment")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService){
        _paymentService = paymentService; 
    }

    [HttpPost]
    public async Task<IActionResult> AddPaymentMethod([FromBody] CreatePaymentMethodDto request)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue("id"));
            var newMethodDto = await _paymentService.AddPaymentMethodAsync(userId, request.Type, request.Provider, request.Token, request.MaskedIdentifier);
            return StatusCode(201, newMethodDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Ocurrió un error al añadir el método de pago.", error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetMyPaymentMethods()
    {
        var userId = int.Parse(User.FindFirstValue("id"));
        var methods = await _paymentService.GetPaymentMethodsByUserIdAsync(userId);
        return Ok(methods);
    }

    [HttpPost("reload")]
    public async Task<IActionResult> ReloadWallet([FromBody] ReloadWalletRequestDto request)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue("id"));
            var transactionDto = await _paymentService.AddMoney(userId, request.PaymentMethodId, request.Amount);
            return Ok(transactionDto);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message }); 
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}