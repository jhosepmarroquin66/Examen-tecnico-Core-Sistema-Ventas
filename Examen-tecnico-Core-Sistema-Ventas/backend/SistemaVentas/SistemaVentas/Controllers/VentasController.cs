using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

namespace SistemaVentas.Controllers
{
    [Authorize] // Protegido por JWT
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly IVentaFacade _ventaFacade;

        public VentasController(IVentaFacade ventaFacade)
        {
            _ventaFacade = ventaFacade;
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarVenta([FromBody] VentaRequest request)
        {
            try
            {
                var resultado = await _ventaFacade.RegistrarVentaCompleta(request);

                if (resultado)
                    return Ok(new { mensaje = "Venta exitosa y stock actualizado." });

                return BadRequest("No se pudo procesar la venta.");
            }
            catch (Exception ex)
            {
                // Aquí capturamos el RAISERROR "Stock insuficiente" de SQL
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var ventas = await _ventaFacade.ListarVentas();
                return Ok(ventas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }
    }
}