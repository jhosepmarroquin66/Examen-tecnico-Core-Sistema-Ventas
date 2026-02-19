using Dapper;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Data;

namespace SistemaVentas.Services.Implementations
{
    public class KardexService : IKardexService
    {
        private readonly DapperContext _context;
        public KardexService(DapperContext context) => _context = context;
        public async Task<IEnumerable<Kardex>> ObtenerKardex()
        {
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Kardex>("SELECT * FROM v_ListarKardex");
        }
    }
}
