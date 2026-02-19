namespace SistemaVentas.Core.Entities
{
    public class CompraRequest
    {
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        // Los totales se pueden calcular en el Facade o recibirlos
        public decimal Total { get; set; }
    }
}
