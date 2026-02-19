using Dapper;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Data;
using System.Data;

namespace SistemaVentas.Services.Facades
{
    public class VentaFacade : IVentaFacade
    {
        private readonly DapperContext _context;

        public VentaFacade(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> RegistrarVentaCompleta(VentaRequest request)
        {
            using (var connection = _context.CreateConnection())
            {
                // Calculamos IGV y Total aquí para enviarlos al SP
                decimal subtotal = request.Total / 1.18m;
                decimal igv = request.Total - subtotal;

                var parameters = new DynamicParameters();
                parameters.Add("IdProducto", request.IdProducto);
                parameters.Add("Cantidad", request.Cantidad);
                parameters.Add("PrecioVenta", request.Total / request.Cantidad);
                parameters.Add("SubTotal", subtotal);
                parameters.Add("Igv", igv);
                parameters.Add("Total", request.Total);

                // Ejecutamos el SP que creamos antes: maneja transacción, stock y movimientos
                var result = await connection.ExecuteAsync(
                    "sp_RegistrarVenta",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result > 0;
            }
        }

        public async Task<IEnumerable<dynamic>> ListarVentas()
        {
            using (var connection = _context.CreateConnection())
            {
                // Ejecutamos el SP que definiste en tu script de BD
                return await connection.QueryAsync("sp_ListarVenta", commandType: CommandType.StoredProcedure);
            }
        }
    }
}