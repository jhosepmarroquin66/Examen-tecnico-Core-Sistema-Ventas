using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SistemaVentas.Controllers
{
    [Authorize] // Exige el Token JWT de 30 minutos
    [ApiController]
    [Route("api/[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly ICompraFacade _facade;
        public ComprasController(ICompraFacade facade) => _facade = facade;

        [HttpPost]
        public async Task<IActionResult> Post(VentaRequest req)
        {
            await _facade.RegistrarCompra(req);
            return Ok("Compra registrada");
        }

        [HttpGet] public async Task<IActionResult> Get() => Ok(await _facade.ListarCompras());
    }
}
