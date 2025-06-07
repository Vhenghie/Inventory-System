-- ================================
-- INSERT QUERIES FOR DASHBOARD DATA
-- ================================

-- 1. CATEGORY TABLE
INSERT INTO [dbo].[category] ([category_name]) VALUES
('Electronics'),
('Clothing'),
('Home & Garden'),
('Books'),
('Sports & Outdoors'),
('Health & Beauty'),
('Automotive'),
('Food & Beverages'),
('Toys & Games'),
('Office Supplies');

-- 2. UNIT TABLE
INSERT INTO [dbo].[unit] ([unit_name]) VALUES
('Piece'),
('Kilogram'),
('Liter'),
('Meter'),
('Box'),
('Pack'),
('Bottle'),
('Bag'),
('Set'),
('Pair');

-- 3. PRODUCTS TABLE
INSERT INTO [dbo].[products] ([products_name], [products_category_id], [products_unit_id], [products_price], [products_stock_quantity]) VALUES
('Smartphone Samsung Galaxy', 1, 1, 599.99, 25),
('Laptop Dell Inspiron', 1, 1, 899.99, 15),
('Bluetooth Headphones', 1, 1, 129.99, 45),
('Wireless Mouse', 1, 1, 39.99, 60),
('USB Cable', 1, 1, 12.99, 100),

('Men''s Cotton T-Shirt', 2, 1, 19.99, 80),
('Women''s Jeans', 2, 1, 49.99, 35),
('Running Shoes', 2, 10, 89.99, 28),
('Winter Jacket', 2, 1, 149.99, 20),
('Baseball Cap', 2, 1, 24.99, 55),

('Garden Hose', 3, 4, 34.99, 22),
('Flower Pot Set', 3, 9, 18.99, 40),
('LED Light Bulbs', 3, 5, 15.99, 75),
('Kitchen Knife Set', 3, 9, 79.99, 18),
('Vacuum Cleaner', 3, 1, 199.99, 12),

('Programming Book', 4, 1, 45.00, 30),
('Cookbook', 4, 1, 25.00, 25),
('Fiction Novel', 4, 1, 12.99, 50),

('Tennis Racket', 5, 1, 89.99, 16),
('Basketball', 5, 1, 29.99, 32),
('Yoga Mat', 5, 1, 24.99, 28),

('Shampoo', 6, 7, 8.99, 65),
('Face Cream', 6, 7, 32.99, 38),
('Vitamin C Tablets', 6, 7, 19.99, 42),

('Car Oil Filter', 7, 1, 14.99, 50),
('Tire Pressure Gauge', 7, 1, 19.99, 25),

('Organic Coffee', 8, 3, 12.99, 85),
('Green Tea', 8, 5, 9.99, 70),
('Protein Bars', 8, 5, 24.99, 45),

('Board Game', 9, 1, 34.99, 22),
('Puzzle 1000 pieces', 9, 1, 19.99, 30),

('Office Chair', 10, 1, 159.99, 18),
('Notebook Pack', 10, 6, 7.99, 90),
('Pen Set', 10, 9, 12.99, 65);

-- 4. USERS TABLE
INSERT INTO [dbo].[users] ([users_name], [users_email], [users_password], [users_isactive], [users_created]) VALUES
('John Smith', 'john.smith@email.com', 'hashed_password_1', 1, '2024-01-15 09:30:00'),
('Sarah Johnson', 'sarah.johnson@email.com', 'hashed_password_2', 1, '2024-01-20 14:45:00'),
('Mike Davis', 'mike.davis@email.com', 'hashed_password_3', 1, '2024-02-05 11:20:00'),
('Emily Brown', 'emily.brown@email.com', 'hashed_password_4', 1, '2024-02-12 16:15:00'),
('David Wilson', 'david.wilson@email.com', 'hashed_password_5', 1, '2024-03-01 10:00:00'),
('Lisa Anderson', 'lisa.anderson@email.com', 'hashed_password_6', 1, '2024-03-10 13:30:00'),
('James Taylor', 'james.taylor@email.com', 'hashed_password_7', 0, '2024-04-01 09:45:00'),
('Maria Garcia', 'maria.garcia@email.com', 'hashed_password_8', 1, '2024-04-15 12:20:00'),
('Robert Miller', 'robert.miller@email.com', 'hashed_password_9', 1, '2024-05-01 15:10:00'),
('Jennifer Lee', 'jennifer.lee@email.com', 'hashed_password_10', 1, '2024-05-20 11:55:00');

-- 5. SALES TABLE (Multiple entries for different months)
INSERT INTO [dbo].[sales] ([sales_description], [sales_product_id], [sales_unit_value], [sales_total_price], [sales_created]) VALUES
-- January Sales
('Sale of Samsung Galaxy phone', 1, 2, 1199.98, '2024-01-05 10:30:00'),
('Dell Laptop purchase', 2, 1, 899.99, '2024-01-08 14:20:00'),
('Bluetooth headphones bulk order', 3, 5, 649.95, '2024-01-12 09:45:00'),
('Office mice order', 4, 10, 399.90, '2024-01-15 16:30:00'),
('USB cables wholesale', 5, 25, 324.75, '2024-01-18 11:15:00'),
('T-shirts retail sale', 6, 8, 159.92, '2024-01-22 13:40:00'),
('Women jeans sale', 7, 3, 149.97, '2024-01-25 15:20:00'),
('Running shoes pair', 8, 2, 179.98, '2024-01-28 12:10:00'),

-- February Sales
('Winter jackets clearance', 9, 4, 599.96, '2024-02-02 10:15:00'),
('Baseball caps bulk', 10, 12, 299.88, '2024-02-05 14:30:00'),
('Garden hose spring prep', 11, 3, 104.97, '2024-02-08 09:20:00'),
('Flower pot sets', 12, 6, 113.94, '2024-02-12 16:45:00'),
('LED bulbs energy efficient', 13, 15, 239.85, '2024-02-15 11:30:00'),
('Kitchen knife professional', 14, 2, 159.98, '2024-02-18 13:15:00'),
('Vacuum cleaner home', 15, 1, 199.99, '2024-02-22 10:45:00'),
('Programming books', 16, 4, 180.00, '2024-02-25 14:20:00'),

-- March Sales
('Cookbooks collection', 17, 3, 75.00, '2024-03-01 09:30:00'),
('Fiction novels bundle', 18, 8, 103.92, '2024-03-05 15:40:00'),
('Tennis racket sports', 19, 2, 179.98, '2024-03-08 12:25:00'),
('Basketball team order', 20, 6, 179.94, '2024-03-12 10:50:00'),
('Yoga mats fitness', 21, 5, 124.95, '2024-03-15 14:35:00'),
('Shampoo bulk purchase', 22, 20, 179.80, '2024-03-18 11:20:00'),
('Face cream beauty', 23, 4, 131.96, '2024-03-22 16:10:00'),
('Vitamin tablets health', 24, 6, 119.94, '2024-03-25 13:45:00'),

-- April Sales
('Car oil filters', 25, 8, 119.92, '2024-04-02 10:20:00'),
('Tire gauges automotive', 26, 4, 79.96, '2024-04-05 14:15:00'),
('Organic coffee premium', 27, 12, 155.88, '2024-04-08 09:40:00'),
('Green tea healthy', 28, 10, 99.90, '2024-04-12 15:25:00'),
('Protein bars fitness', 29, 8, 199.92, '2024-04-15 12:30:00'),
('Board games family', 30, 3, 104.97, '2024-04-18 11:45:00'),
('Puzzles entertainment', 31, 5, 99.95, '2024-04-22 16:20:00'),
('Office chairs ergonomic', 32, 2, 319.98, '2024-04-25 13:55:00'),

-- May Sales
('Notebook packs office', 33, 15, 119.85, '2024-05-01 10:10:00'),
('Pen sets professional', 34, 8, 103.92, '2024-05-05 14:40:00'),
('Smartphone upgrade', 1, 3, 1799.97, '2024-05-08 09:25:00'),
('Laptop business order', 2, 2, 1799.98, '2024-05-12 15:50:00'),
('Headphones premium', 3, 7, 909.93, '2024-05-15 12:15:00'),
('Mouse office setup', 4, 20, 799.80, '2024-05-18 11:30:00'),
('Clothing summer sale', 6, 15, 299.85, '2024-05-22 16:35:00'),
('Sports equipment', 19, 4, 359.96, '2024-05-25 13:20:00'),

-- June Sales (Current Month)
('Latest smartphone model', 1, 1, 599.99, '2024-06-01 10:45:00'),
('Laptop student discount', 2, 1, 799.99, '2024-06-03 14:20:00'),
('Headphones sale', 3, 3, 389.97, '2024-06-05 09:30:00'),
('Summer clothing', 6, 12, 239.88, '2024-06-06 11:15:00');

-- 6. INVENTORY MOVEMENT TABLE
INSERT INTO [dbo].[inventory_movement] ([inventory_movement_product_id], [inventory_movement_type], [inventory_movement_quantity], [inventory_movement_notes], [inventory_movement_date]) VALUES
-- Stock Replenishments (In)
(1, 'In', 50, 'Initial stock - Samsung Galaxy', '2024-01-01 09:00:00'),
(2, 'In', 30, 'Initial stock - Dell Laptop', '2024-01-01 09:00:00'),
(3, 'In', 75, 'Initial stock - Bluetooth Headphones', '2024-01-01 09:00:00'),
(4, 'In', 100, 'Initial stock - Wireless Mouse', '2024-01-01 09:00:00'),
(5, 'In', 200, 'Initial stock - USB Cables', '2024-01-01 09:00:00'),

(1, 'In', 25, 'Restock - Samsung Galaxy', '2024-02-15 10:30:00'),
(2, 'In', 15, 'Restock - Dell Laptop', '2024-02-15 10:30:00'),
(3, 'In', 30, 'Restock - Bluetooth Headphones', '2024-03-01 11:00:00'),

-- Sales Outgoing (Out)
(1, 'Out', 2, 'Sale - Samsung Galaxy', '2024-01-05 10:30:00'),
(2, 'Out', 1, 'Sale - Dell Laptop', '2024-01-08 14:20:00'),
(3, 'Out', 5, 'Sale - Bluetooth Headphones', '2024-01-12 09:45:00'),
(4, 'Out', 10, 'Sale - Wireless Mouse', '2024-01-15 16:30:00'),
(5, 'Out', 25, 'Sale - USB Cables', '2024-01-18 11:15:00'),

(6, 'In', 120, 'Initial stock - T-Shirts', '2024-01-01 09:00:00'),
(7, 'In', 60, 'Initial stock - Women Jeans', '2024-01-01 09:00:00'),
(8, 'In', 50, 'Initial stock - Running Shoes', '2024-01-01 09:00:00'),

(6, 'Out', 8, 'Sale - T-Shirts', '2024-01-22 13:40:00'),
(7, 'Out', 3, 'Sale - Women Jeans', '2024-01-25 15:20:00'),
(8, 'Out', 2, 'Sale - Running Shoes', '2024-01-28 12:10:00'),

-- More inventory movements for better analytics
(1, 'Out', 3, 'Sale - Samsung Galaxy', '2024-05-08 09:25:00'),
(2, 'Out', 2, 'Sale - Dell Laptop', '2024-05-12 15:50:00'),
(3, 'Out', 7, 'Sale - Bluetooth Headphones', '2024-05-15 12:15:00'),
(4, 'Out', 20, 'Sale - Wireless Mouse', '2024-05-18 11:30:00'),

-- Damaged/Lost inventory
(1, 'Out', 1, 'Damaged during shipping', '2024-03-10 14:20:00'),
(3, 'Out', 2, 'Return - Defective units', '2024-04-05 10:15:00'),

-- Recent movements
(1, 'Out', 1, 'Sale - Samsung Galaxy', '2024-06-01 10:45:00'),
(2, 'Out', 1, 'Sale - Dell Laptop', '2024-06-03 14:20:00'),
(3, 'Out', 3, 'Sale - Bluetooth Headphones', '2024-06-05 09:30:00'),
(6, 'Out', 12, 'Sale - T-Shirts', '2024-06-06 11:15:00');