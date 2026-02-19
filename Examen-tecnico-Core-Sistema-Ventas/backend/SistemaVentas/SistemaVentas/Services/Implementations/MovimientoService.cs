using Dapper;
using SistemaVentas.Core.Entities;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Data;
using System.Data;

namespace SistemaVentas.Services.Implementations
{
    public class MovimientoService : IMovimientoService
    {
        private readonly DapperContext _context;

        public MovimientoService(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MovimientoDetalle>> ListarDetallePorProducto(int idProducto)
        {
            // Definimos el nombre del SP que creaste en SQL
            string spName = "sp_ListarMovimientosDetalle";

            // Creamos los parámetros para el SP
            var parameters = new DynamicParameters();
            parameters.Add("IdProducto", idProducto, DbType.Int32);

            using (var connection = _context.CreateConnection())
            {
                // Ejecutamos el SP indicando que es de tipo StoredProcedure
                return await connection.QueryAsync<MovimientoDetalle>(
                    spName,
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }
    }
}