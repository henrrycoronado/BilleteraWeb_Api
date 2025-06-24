using AppBackend.Models;

namespace AppBackend.Services;

public interface IWeatherService
{
    IEnumerable<WeatherForecast> GetForecast();
}
