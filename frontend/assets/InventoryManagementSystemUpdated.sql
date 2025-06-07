------------------------ CATEGORY
CREATE TABLE [dbo].[category](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[category_name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[category_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

------------------------ UNIT
CREATE TABLE [dbo].[unit](
	[unit_id] [int] IDENTITY(1,1) NOT NULL,
	[unit_name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[unit_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[unit_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

------------------------ PRODUCT
CREATE TABLE [dbo].[products](
	[products_id] [int] IDENTITY(1,1) NOT NULL,
	[products_name] [nvarchar](100) NOT NULL,
	[products_category_id] [int] NOT NULL,
	[products_unit_id] [int] NOT NULL,
	[products_price] [decimal](10, 2) NOT NULL,
	[products_stock_quantity] [decimal](10, 2) NULL,
PRIMARY KEY CLUSTERED 
(
	[products_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[products] ADD  DEFAULT ((0)) FOR [products_stock_quantity]
GO

ALTER TABLE [dbo].[products]  WITH CHECK ADD FOREIGN KEY([products_category_id])
REFERENCES [dbo].[category] ([category_id])
GO

ALTER TABLE [dbo].[products]  WITH CHECK ADD FOREIGN KEY([products_unit_id])
REFERENCES [dbo].[unit] ([unit_id])
GO

------------------------ SALES

CREATE TABLE [dbo].[sales](
	[sales_id] [int] IDENTITY(1,1) NOT NULL,
	[sales_description] [varchar](250) NOT NULL,
	[sales_product_id] [int] NOT NULL,
	[sales_unit_value] [decimal] NOT NULL,
	[sales_total_price] [decimal] NOT NULL,
	[sales_created] [datetime] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[sales] ADD  DEFAULT (getdate()) FOR [sales_created]
GO

------------------------ INVENTORY MOVEMENT
CREATE TABLE [dbo].[inventory_movement](
	[inventory_movement_id] [int] IDENTITY(1,1) NOT NULL,
	[inventory_movement_product_id] [int] NULL,
	[inventory_movement_type] [nvarchar](10) NOT NULL,
	[inventory_movement_quantity] [decimal](10, 2) NULL,
	[inventory_movement_notes] [nvarchar](255) NULL,
	[inventory_movement_date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[inventory_movement_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[inventory_movement] ADD  DEFAULT ((0)) FOR [inventory_movement_quantity]
GO

ALTER TABLE [dbo].[inventory_movement] ADD  DEFAULT (getdate()) FOR [inventory_movement_date]
GO

ALTER TABLE [dbo].[inventory_movement]  WITH CHECK ADD  CONSTRAINT [FK_inventory_movement_product_id] FOREIGN KEY([inventory_movement_product_id])
REFERENCES [dbo].[products] ([products_id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[inventory_movement] CHECK CONSTRAINT [FK_inventory_movement_product_id]
GO

ALTER TABLE [dbo].[inventory_movement]  WITH CHECK ADD CHECK  (([inventory_movement_type]='Out' OR [inventory_movement_type]='In'))
GO

------------------------ USER
CREATE TABLE [dbo].[users](
	[users_id] [int] IDENTITY(1,1) NOT NULL,
	[users_name] [nvarchar](100) NOT NULL,
	[users_email] [nvarchar](100) NOT NULL,
	[users_password] [nvarchar](255) NOT NULL,
	[users_isactive] [bit] NULL,
	[users_created] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[users_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[users_email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT ((1)) FOR [users_isactive]
GO

ALTER TABLE [dbo].[users] ADD  DEFAULT (getdate()) FOR [users_created]
GO
