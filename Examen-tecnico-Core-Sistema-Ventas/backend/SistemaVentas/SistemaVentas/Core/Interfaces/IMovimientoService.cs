using SistemaVentas.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SistemaVentas.Core.Interfaces
{
    public interface IMovimientoService
    {
        Task<IEnumerable<MovimientoDetalle>> ListarDetallePorProducto(int idProducto);
    }
}