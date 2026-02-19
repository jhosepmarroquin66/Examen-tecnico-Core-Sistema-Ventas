using SistemaVentas.Core.Entities;

namespace SistemaVentas.Core.Interfaces
{
    public interface IVentaFacade
    {
        // La fachada simplifica la operación de venta para el controlador
        Task<bool> RegistrarVentaCompleta(VentaRequest request);
        // método para listar
        Task<IEnumerable<dynamic>> ListarVentas();
    }
}