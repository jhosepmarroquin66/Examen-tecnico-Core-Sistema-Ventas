using Dapper;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Data;
using System.Data;
using SistemaVentas.Core.Entities;

namespace SistemaVentas.Data
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly DapperContext _context;

        public ProductoRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Producto>> Listar()
        {
            using (var connection = _context.CreateConnection())
            {
                // sp_ListarProducto es el nombre exacto que pusimos en SQL
                return await connection.QueryAsync<Producto>(
                    "sp_ListarProducto",
                    commandType: CommandType.StoredProcedure
                );
            }
        }

        public async Task<int> Insertar(Producto producto)
        {
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("Nombre", producto.Nombre_producto);
                parameters.Add("Lote", producto.NroLote);
                parameters.Add("Costo", producto.Costo);
                parameters.Add("Precio", producto.PrecioVenta);

                return await connection.ExecuteAsync(
                    "sp_InsertarProducto",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }

        public async Task<bool> Actualizar(Producto producto)
        {
            using (var connection = _context.CreateConnection())
            {
                var parameters = new DynamicParameters();
                parameters.Add("Id", producto.Id_producto);
                parameters.Add("Nombre", producto.Nombre_producto);
                parameters.Add("Lote", producto.NroLote);
                parameters.Add("Costo", producto.Costo);
                parameters.Add("Precio", producto.PrecioVenta);

                var rows = await connection.ExecuteAsync(
                    "sp_ActualizarProducto",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
                return rows > 0;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            using (var connection = _context.CreateConnection())
            {
                var rows = await connection.ExecuteAsync(
                    "sp_EliminarProducto",
                    new { Id = id },
                    commandType: CommandType.StoredProcedure
                );
                return rows > 0;
            }
        }
    }
}