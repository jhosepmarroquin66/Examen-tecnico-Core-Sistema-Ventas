using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;

namespace SistemaVentas.Services.Implementations
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;

        public ProductoService(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }

        public async Task<IEnumerable<Producto>> Listar()
        {
            // Aquí podrías agregar lógica de negocio, 
            // como filtrar solo productos con stock, etc.
            return await _productoRepository.Listar();
        }

        public async Task<int> Insertar(Producto producto)
        {
            // Ejemplo de validación simple
            if (string.IsNullOrEmpty(producto.Nombre_producto))
                throw new Exception("El nombre del producto es obligatorio.");

            return await _productoRepository.Insertar(producto);
        }

        public async Task<bool> Actualizar(Producto producto)
        {
            return await _productoRepository.Actualizar(producto);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _productoRepository.Eliminar(id);
        }
    }
}