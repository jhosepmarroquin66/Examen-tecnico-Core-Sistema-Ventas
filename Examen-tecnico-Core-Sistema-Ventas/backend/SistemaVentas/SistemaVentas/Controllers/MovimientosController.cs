using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

namespace SistemaVentas.Controllers
{
    [Authorize] // Exige el Token JWT de 30 minutos
    [ApiController]
    [Route("api/[controller]")] // La ruta será: api/Movimientos
    public class MovimientosController : ControllerBase
    {
        private readonly IMovimientoService _movimientoService;

        // Inyectamos la interfaz del servicio
        public MovimientosController(IMovimientoService movimientoService)
        {
            _movimientoService = movimientoService;
        }

        [HttpGet("producto/{id}")] // Ruta: api/Movimientos/producto/5
        public async Task<IActionResult> GetMovimientosPorProducto(int id)
        {
            try
            {
                // Llamamos al servicio que usa Dapper y el SP
                var movimientos = await _movimientoService.ListarDetallePorProducto(id);

                if (movimientos == null)
                {
                    return NotFound(new { message = "No se encontraron movimientos para este producto." });
                }

                return Ok(movimientos);
            }
            catch (Exception ex)
            {
                // En caso de error en el SP o conexión
                return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
            }
        }
    }
}