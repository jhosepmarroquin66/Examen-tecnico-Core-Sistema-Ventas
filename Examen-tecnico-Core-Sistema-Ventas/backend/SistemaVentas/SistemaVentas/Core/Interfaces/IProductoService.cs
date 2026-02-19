using SistemaVentas.Core.Entities;

namespace SistemaVentas.Core.Interfaces
{
    public interface IProductoService
    {
        Task<IEnumerable<Producto>> Listar();
        Task<int> Insertar(Producto producto);
        Task<bool> Actualizar(Producto producto);
        Task<bool> Eliminar(int id);
    }
}