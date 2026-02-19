using SistemaVentas.Core.Entities;

namespace SistemaVentas.Core.Interfaces
{
    public interface ICompraFacade
    {
        Task RegistrarCompra(VentaRequest compra); // Usamos el mismo DTO o crea CompraRequest
        Task<IEnumerable<dynamic>> ListarCompras();
    }
}
