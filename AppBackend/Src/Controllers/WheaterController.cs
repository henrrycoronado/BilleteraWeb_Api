using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AppBackend.Models;
using AppBackend.Services;

namespace AppBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IWeatherService _weatherService;

        public WeatherForecastController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        // Endpoint público (aparece en Swagger)
        [HttpGet]
        public IActionResult Get(string palabra)
        {
            var result = _weatherService.GetForecast();
            return Ok(result);
        }

        // Endpoint oculto (no aparece en Swagger)
        //[ApiExplorerSettings(IgnoreApi = true)]
        [Authorize]
        [HttpGet("oculto")]
        public IActionResult GetHidden()
        {
            return Ok("Este endpoint está oculto en Swagger");
        }
    }
}
