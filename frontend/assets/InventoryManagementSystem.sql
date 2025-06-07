CREATE TABLE users (
    users_id INT PRIMARY KEY IDENTITY(1,1),
    users_name NVARCHAR(100) NOT NULL,
    users_email NVARCHAR(100) UNIQUE NOT NULL,
    users_password NVARCHAR(255) NOT NULL,
    users_isactive BIT DEFAULT 1,
    users_created DATETIME DEFAULT GETDATE()
);

CREATE TABLE category (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE unit (
    unit_id INT PRIMARY KEY IDENTITY(1,1),
    unit_name NVARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
    products_id INT PRIMARY KEY IDENTITY(1,1),
    products_name NVARCHAR(100) NOT NULL,
    products_category_id INT NOT NULL FOREIGN KEY REFERENCES category(category_id),
    products_unit_id INT NOT NULL FOREIGN KEY REFERENCES unit(unit_id),
    products_price DECIMAL(10,2) NOT NULL,
    products_stock_quantity DECIMAL(10, 2) DEFAULT 0,
    products_status NVARCHAR(20) NOT NULL,
);

CREATE TRIGGER trg_UpdateProductStockStatus
ON products
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET products_status = 
        CASE 
            WHEN p.products_stock_quantity < 20 THEN 'Critical'
            WHEN p.products_stock_quantity >= 20 AND p.products_stock_quantity <= 50 THEN 'Warning'
            ELSE 'Good'
        END
    FROM product p
    INNER JOIN inserted i ON p.products_id = i.products_id;
END;


CREATE TABLE inventory_movement (
    inventory_movement_id INT PRIMARY KEY IDENTITY(1,1),
    inventory_movement_product_id INT FOREIGN KEY REFERENCES products(products_id),
    inventory_movement_type NVARCHAR(10) CHECK (inventory_movement_type IN ('In', 'Out')) NOT NULL,
    inventory_movement_quantity DECIMAL(10, 2) DEFAULT 0,
    inventory_movement_notes NVARCHAR(255),
    inventory_movement_date DATETIME DEFAULT GETDATE()
);

