using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.Core.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SistemaVentas.Controllers
{
    [Authorize] // Exige el Token JWT de 30 minutos
    [ApiController]
    [Route("api/[controller]")]
    public class KardexController : ControllerBase
    {
        private readonly IKardexService _service;
        public KardexController(IKardexService service) => _service = service;

        [HttpGet] public async Task<IActionResult> Get() => Ok(await _service.ObtenerKardex());
    }
}
