using Microsoft.AspNetCore.Mvc;

namespace BilleteraWebBack.Controllers
{
    public class ServicioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
