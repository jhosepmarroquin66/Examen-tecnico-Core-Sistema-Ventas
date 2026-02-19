using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

namespace SistemaVentas.Controllers
{
    [Authorize] // Exige el Token JWT de 30 minutos
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        // Inyectamos IProductoService. 
        // .NET enviará el Decorador (Logging) que envuelve al Servicio Real.
        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var productos = await _productoService.Listar();
            return Ok(productos);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Producto producto)
        {
            if (producto == null) return BadRequest("Datos inválidos");

            var idCreado = await _productoService.Insertar(producto);
            return Ok(new { mensaje = "Producto creado con éxito", id = idCreado });
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody] Producto producto)
        {
            var actualizado = await _productoService.Actualizar(producto);
            if (!actualizado) return NotFound("Producto no encontrado o no actualizado");

            return Ok(new { mensaje = "Producto actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _productoService.Eliminar(id);
            if (!eliminado) return NotFound("El producto no existe");

            return Ok(new { mensaje = "Producto eliminado" });
        }
    }
}