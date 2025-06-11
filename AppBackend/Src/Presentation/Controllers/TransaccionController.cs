using Microsoft.AspNetCore.Mvc;

namespace BilleteraWebBack.Controllers
{
    public class TransaccionController : Controller
    {
        private readonly ICoreBanco _coreBanco;
        public IActionResult Index()
        {
            return View();
        }
        public void ValidarDatos(){
            
        };

        public void CrearTransaccion(){
            ValidarDatos();
        };

        
    }
}
