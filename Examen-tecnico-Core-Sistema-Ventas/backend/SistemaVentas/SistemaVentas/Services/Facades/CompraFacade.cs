using Dapper;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Data;
using System.Data;

namespace SistemaVentas.Services.Facades
{
    public class CompraFacade : ICompraFacade
    {
        private readonly DapperContext _context;
        public CompraFacade(DapperContext context) => _context = context;

        public async Task RegistrarCompra(VentaRequest compra)
        {
            using var conn = _context.CreateConnection();
            var p = new
            {
                IdProducto = compra.IdProducto,
                Cantidad = compra.Cantidad,
                CostoCompra = compra.Precio,
                SubTotal = compra.Total / 1.18m,
                Igv = compra.Total - (compra.Total / 1.18m),
                Total = compra.Total
            };
            await conn.ExecuteAsync("sp_RegistrarCompra", p, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<dynamic>> ListarCompras()
        {
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync("sp_ListarCompra", commandType: CommandType.StoredProcedure);
        }
    }
}
