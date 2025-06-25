using System.Security.Claims;

namespace Application.Interfaces;

public interface ITokenGenerator
{
    string Generate(IEnumerable<Claim> claims, TimeSpan expiresIn);
    ClaimsPrincipal? Validate(string token);
}