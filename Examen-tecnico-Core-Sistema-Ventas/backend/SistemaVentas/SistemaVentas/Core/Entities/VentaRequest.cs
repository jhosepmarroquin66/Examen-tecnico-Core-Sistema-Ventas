namespace SistemaVentas.Core.Entities
{
    public class VentaRequest
    {
        // El ID del producto al que se le aplicará el movimiento
        public int IdProducto { get; set; }

        // Cantidad de unidades (se resta en venta, se suma en compra)
        public int Cantidad { get; set; }

        // PrecioVenta (para sp_RegistrarVenta) o CostoCompra (para sp_RegistrarCompra)
        public decimal Precio { get; set; }

        // Monto total de la transacción (incluyendo IGV)
        public decimal Total { get; set; }
    }
}