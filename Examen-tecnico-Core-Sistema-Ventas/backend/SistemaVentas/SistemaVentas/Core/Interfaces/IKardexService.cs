using SistemaVentas.Core.Entities;

namespace SistemaVentas.Core.Interfaces
{
    public interface IKardexService
    {
        Task<IEnumerable<Kardex>> ObtenerKardex();
    }
}
