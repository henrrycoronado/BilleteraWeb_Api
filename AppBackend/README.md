Proyecto creado con .net9 usando :
    - dotnet new webapi -n nombreProyecto

se instala packages con :
    dotnet add package Swashbuckle.AspNetCore
    dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer


compilacion y ejecucion con:
    dotnet build
    dotnet run


recursos:

usar para ocultar un endpoint de un controller:
    [ApiExplorerSettings(IgnoreApi = true)]