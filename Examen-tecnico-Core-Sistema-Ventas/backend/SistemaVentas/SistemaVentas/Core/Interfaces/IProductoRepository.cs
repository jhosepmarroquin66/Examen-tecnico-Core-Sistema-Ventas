using SistemaVentas.Core.Entities;

namespace SistemaVentas.Core.Interfaces
{
    public interface IProductoRepository
    {
        // Método para obtener todos los productos (Usa la entidad Producto)
        Task<IEnumerable<Producto>> Listar();

        // Método para insertar un producto y devolver el ID generado
        Task<int> Insertar(Producto producto);

        // Método para actualizar datos de un producto existente
        Task<bool> Actualizar(Producto producto);

        // Método para eliminar un producto por su ID
        Task<bool> Eliminar(int id);
    }
}