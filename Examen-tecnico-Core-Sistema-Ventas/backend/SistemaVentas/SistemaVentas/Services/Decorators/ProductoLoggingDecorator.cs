using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

namespace SistemaVentas.Services.Decorators
{
    public class ProductoLoggingDecorator : IProductoService
    {
        private readonly IProductoService _innerService;
        private readonly ILogger<ProductoLoggingDecorator> _logger;

        // Recibe el servicio real (ProductoService) y el Logger a través del constructor
        public ProductoLoggingDecorator(IProductoService innerService, ILogger<ProductoLoggingDecorator> logger)
        {
            _innerService = innerService;
            _logger = logger;
        }

        public async Task<IEnumerable<Producto>> Listar()
        {
            _logger.LogInformation("Iniciando consulta de productos a las {Time}", DateTime.Now);

            var resultado = await _innerService.Listar();

            _logger.LogInformation("Consulta finalizada. Se encontraron {Count} productos.", resultado.Count());
            return resultado;
        }

        public async Task<int> Insertar(Producto producto)
        {
            _logger.LogInformation("Intentando insertar producto: {Nombre}", producto.Nombre_producto);

            var id = await _innerService.Insertar(producto);

            _logger.LogInformation("Producto insertado con éxito. ID generado: {Id}", id);
            return id;
        }

        public async Task<bool> Actualizar(Producto producto)
        {
            _logger.LogInformation("Actualizando producto ID: {Id}", producto.Id_producto);
            return await _innerService.Actualizar(producto);
        }

        public async Task<bool> Eliminar(int id)
        {
            _logger.LogWarning("Se ha solicitado la eliminación del producto ID: {Id}", id);
            return await _innerService.Eliminar(id);
        }
    }
}