﻿using Microsoft.AspNetCore.Mvc;

namespace BilleteraWebBack.Controllers
{
    public class UsuarioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
