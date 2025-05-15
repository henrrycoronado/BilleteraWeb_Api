using BilleteraWebBack.Models;
using Microsoft.AspNetCore.Mvc;

namespace BilleteraWebBack.Controllers
{
    public class ExtractoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public Extracto generarExtracto()
        {
            return new Extracto();
        }
    }
}
