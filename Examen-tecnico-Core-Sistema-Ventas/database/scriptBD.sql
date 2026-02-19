/* =============================================================
   EXAMEN: SISTEMA DE VENTAS Y KARDEX (MICROSERVICIOS)
   BASE DE DATOS: SistemaVentas
   ============================================================= */

USE master;
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SistemaVentas')
    DROP DATABASE SistemaVentas;
GO
CREATE DATABASE SistemaVentas;
GO
USE SistemaVentas;
GO

-- =============================================
-- 1. ESTRUCTURA DE TABLAS (REQUERIMIENTO 2.1)
-- =============================================

CREATE TABLE Productos (
    Id_producto INT PRIMARY KEY IDENTITY(1,1),
    Nombre_producto VARCHAR(100) NOT NULL,
    NroLote VARCHAR(50),
    Fec_registro DATETIME DEFAULT GETDATE(),
    Costo DECIMAL(18,2) DEFAULT 0,
    PrecioVenta DECIMAL(18,2) DEFAULT 0
);

CREATE TABLE CompraCab (
    Id_CompraCab INT PRIMARY KEY IDENTITY(1,1),
    FecRegistro DATETIME DEFAULT GETDATE(),
    SubTotal DECIMAL(18,2),
    Igv DECIMAL(18,2),
    Total DECIMAL(18,2)
);

CREATE TABLE CompraDet (
    Id_CompraDet INT PRIMARY KEY IDENTITY(1,1),
    Id_CompraCab INT CONSTRAINT FK_CompraCab FOREIGN KEY REFERENCES CompraCab(Id_CompraCab),
    Id_producto INT CONSTRAINT FK_ProdCompra FOREIGN KEY REFERENCES Productos(Id_producto),
    Cantidad INT,
    Precio DECIMAL(18,2),
    Sub_Total DECIMAL(18,2),
    Igv DECIMAL(18,2),
    Total DECIMAL(18,2)
);

CREATE TABLE VentaCab (
    Id_VentaCab INT PRIMARY KEY IDENTITY(1,1),
    fecRegistro DATETIME DEFAULT GETDATE(),
    SubTotal DECIMAL(18,2),
    Igv DECIMAL(18,2),
    Total DECIMAL(18,2)
);

CREATE TABLE VentaDet (
    Id_VentaDet INT PRIMARY KEY IDENTITY(1,1),
    Id_VentaCab INT CONSTRAINT FK_VentaCab FOREIGN KEY REFERENCES VentaCab(Id_VentaCab),
    Id_producto INT CONSTRAINT FK_ProdVenta FOREIGN KEY REFERENCES Productos(Id_producto),
    Cantidad INT,
    Precio DECIMAL(18,2),
    Sub_Total DECIMAL(18,2),
    Igv DECIMAL(18,2),
    Total DECIMAL(18,2)
);

CREATE TABLE MovimientoCab (
    Id_MovimientoCab INT PRIMARY KEY IDENTITY(1,1),
    Fec_registro DATETIME DEFAULT GETDATE(),
    Id_TipoMovimiento INT, -- (1) Entrada , (2) Salida
    Id_DocumentoOrigen INT
);

CREATE TABLE Movimientodet (
    Id_MovimientoDet INT PRIMARY KEY IDENTITY(1,1),
    Id_movimientocab INT CONSTRAINT FK_MovCab FOREIGN KEY REFERENCES MovimientoCab(Id_MovimientoCab),
    Id_Producto INT CONSTRAINT FK_ProdMov FOREIGN KEY REFERENCES Productos(Id_producto),
    Cantidad INT
);
GO

-- =============================================
-- 2. VISTA PARA KARDEX
-- =============================================
CREATE VIEW v_ListarKardex AS
SELECT 
    p.Id_producto, 
    p.Nombre_producto, 
    ISNULL(SUM(CASE WHEN mc.Id_TipoMovimiento = 1 THEN md.Cantidad ELSE -md.Cantidad END), 0) AS stock_actual,
    p.Costo, 
    p.PrecioVenta
FROM Productos p
LEFT JOIN Movimientodet md ON p.Id_producto = md.Id_Producto
LEFT JOIN MovimientoCab mc ON md.Id_movimientocab = mc.Id_MovimientoCab
GROUP BY p.Id_producto, p.Nombre_producto, p.Costo, p.PrecioVenta;
GO

-- =============================================
-- 3. PROCEDIMIENTOS CRUD (PRODUCTOS)
-- =============================================

CREATE PROCEDURE sp_ListarProducto
AS 
BEGIN 
    SELECT * FROM Productos; 
END;
GO

CREATE PROCEDURE sp_InsertarProducto 
    @Nombre VARCHAR(100), 
    @Lote VARCHAR(50), 
    @Costo DECIMAL(18,2), 
    @Precio DECIMAL(18,2)
AS 
BEGIN 
    INSERT INTO Productos (Nombre_producto, NroLote, Costo, PrecioVenta) 
    VALUES (@Nombre, @Lote, @Costo, @Precio); 
END;
GO

CREATE PROCEDURE sp_ActualizarProducto
    @Id INT, 
    @Nombre VARCHAR(100), 
    @Lote VARCHAR(50), 
    @Costo DECIMAL(18,2), 
    @Precio DECIMAL(18,2)
AS 
BEGIN
    UPDATE Productos 
    SET Nombre_producto = @Nombre, 
        NroLote = @Lote, 
        Costo = @Costo, 
        PrecioVenta = @Precio 
    WHERE Id_producto = @Id;
END;
GO

CREATE PROCEDURE sp_EliminarProducto @Id INT 
AS 
BEGIN 
    DELETE FROM Productos WHERE Id_producto = @Id; 
END;
GO

-- =============================================
-- 4. PROCEDIMIENTOS LISTAR COMPRA / VENTA
-- =============================================

CREATE PROCEDURE sp_ListarCompra 
AS 
BEGIN 
    SELECT * FROM CompraCab; 
END;
GO

CREATE PROCEDURE sp_ListarVenta 
AS 
BEGIN 
    SELECT * FROM VentaCab; 
END;
GO

CREATE PROCEDURE sp_ListarMovimientosDetalle @IdProducto INT
AS 
BEGIN
    SELECT mc.Fec_registro, 
           CASE WHEN mc.Id_TipoMovimiento = 1 THEN 'Entrada (Compra)' ELSE 'Salida (Venta)' END AS TipoMovimiento, 
           md.Cantidad
    FROM MovimientoCab mc 
    INNER JOIN Movimientodet md ON mc.Id_MovimientoCab = md.Id_movimientocab
    WHERE md.Id_Producto = @IdProducto 
    ORDER BY mc.Fec_registro DESC;
END;
GO

-- =============================================
-- 5. PROCEDIMIENTOS TRANSACCIONALES
-- =============================================

CREATE PROCEDURE sp_RegistrarCompra
    @IdProducto INT, 
    @Cantidad INT, 
    @CostoCompra DECIMAL(18,2), 
    @SubTotal DECIMAL(18,2), 
    @Igv DECIMAL(18,2), 
    @Total DECIMAL(18,2)
AS 
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION
    BEGIN TRY
        INSERT INTO CompraCab (SubTotal, Igv, Total) VALUES (@SubTotal, @Igv, @Total);
        DECLARE @IdC INT = SCOPE_IDENTITY();

        INSERT INTO CompraDet (Id_CompraCab, Id_producto, Cantidad, Precio, Sub_Total, Igv, Total)
        VALUES (@IdC, @IdProducto, @Cantidad, @CostoCompra, @SubTotal, @Igv, @Total);

        UPDATE Productos SET Costo = @CostoCompra, PrecioVenta = (@CostoCompra * 1.35) WHERE Id_producto = @IdProducto;

        INSERT INTO MovimientoCab (Id_TipoMovimiento, Id_DocumentoOrigen) VALUES (1, @IdC);
        DECLARE @IdM INT = SCOPE_IDENTITY();
        INSERT INTO Movimientodet (Id_movimientocab, Id_Producto, Cantidad) VALUES (@IdM, @IdProducto, @Cantidad);
        
        COMMIT TRANSACTION;
    END TRY 
    BEGIN CATCH 
        ROLLBACK TRANSACTION; 
        THROW; 
    END CATCH
END;
GO

CREATE PROCEDURE sp_RegistrarVenta
    @IdProducto INT, 
    @Cantidad INT, 
    @PrecioVenta DECIMAL(18,2), 
    @SubTotal DECIMAL(18,2), 
    @Igv DECIMAL(18,2), 
    @Total DECIMAL(18,2)
AS 
BEGIN
    -- Quitamos el SET NOCOUNT ON para que Dapper pueda leer el éxito
    DECLARE @StockActual INT;
    
    -- Usamos tu vista de Kardex para validar
    SELECT @StockActual = stock_actual FROM v_ListarKardex WHERE Id_producto = @IdProducto;

    IF (@Cantidad > ISNULL(@StockActual, 0)) 
    BEGIN 
        RAISERROR('Stock insuficiente.', 16, 1); 
        RETURN; 
    END

    BEGIN TRANSACTION
    BEGIN TRY
        INSERT INTO VentaCab (fecRegistro, SubTotal, Igv, Total) 
        VALUES (GETDATE(), @SubTotal, @Igv, @Total);
        
        DECLARE @IdV INT = SCOPE_IDENTITY();

        INSERT INTO VentaDet (Id_VentaCab, Id_producto, Cantidad, Precio, Sub_Total, Igv, Total)
        VALUES (@IdV, @IdProducto, @Cantidad, @PrecioVenta, @SubTotal, @Igv, @Total);

        -- Movimiento Tipo 2 = SALIDA
        INSERT INTO MovimientoCab (Fec_registro, Id_TipoMovimiento, Id_DocumentoOrigen) 
        VALUES (GETDATE(), 2, @IdV);
        
        DECLARE @IdM INT = SCOPE_IDENTITY();
        
        INSERT INTO Movimientodet (Id_movimientocab, Id_Producto, Cantidad) 
        VALUES (@IdM, @IdProducto, @Cantidad);
        
        COMMIT TRANSACTION;
        
        -- ESTO es para asegurar que Dapper reciba un 1 (Éxito)
        SELECT 1 AS Resultado; 
    END TRY 
    BEGIN CATCH 
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; 
        THROW; 
    END CATCH
END;
GO

-- =============================================
-- 6. DATOS DE PRUEBA
-- =============================================
INSERT INTO Productos (Nombre_producto, NroLote, Costo, PrecioVenta)
VALUES 
('Laptop HP 15"', 'LOT-2024-X', 1200.00, 1620.00),
('Mouse Logi Wireless', 'LOT-2024-Y', 25.00, 33.75),
('Monitor Samsung 27"', 'LOT-2024-Z', 180.00, 243.00);
GO

-- 1. Insertamos la cabecera (Tipo 1 = Ingreso)
-- Nota: Dejamos Id_DocumentoOrigen como NULL o 0 si no tienes un documento de referencia
INSERT INTO MovimientoCab (Fec_registro, Id_TipoMovimiento, Id_DocumentoOrigen) 
VALUES (GETDATE(), 1, NULL);

-- 2. Capturamos el ID generado automáticamente
DECLARE @IdCabReciente INT = SCOPE_IDENTITY();

-- 3. Insertamos 100 unidades para cada producto existente
INSERT INTO Movimientodet (Id_movimientocab, Id_Producto, Cantidad)
SELECT @IdCabReciente, Id_producto, 100 FROM Productos;
