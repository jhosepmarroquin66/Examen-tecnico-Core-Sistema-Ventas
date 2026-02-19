namespace SistemaVentas.Core.Entities
{
    public class Kardex
    {
        public int Id_producto { get; set; }
        public string Nombre_producto { get; set; }
        public int stock_actual { get; set; }
        public decimal Costo { get; set; }
        public decimal PrecioVenta { get; set; }
    }
}
