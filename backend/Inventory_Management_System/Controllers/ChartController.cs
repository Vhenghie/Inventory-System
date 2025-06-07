using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Product;
using Inventory_Management_System.Model.DTO.Category;
using Inventory_Management_System.Model.DTO.InventoryMovement;
using Inventory_Management_System.Model.DTO.Sale;
using Inventory_Management_System.Model.DTO.Unit;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Mvc;

namespace Inventory_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChartController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChartController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
        }

        [HttpGet]
        [Route("top_selling_products")]
        public IActionResult GetTopSellingProducts()
        {
            var result = new List<object>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                SELECT TOP 10
                    p.products_name,
                        SUM(s.sales_total_price) AS Total_Revenue,
                    SUM(s.sales_unit_value) AS Units_Sold
                FROM sales s
                JOIN products p ON s.sales_product_id = p.products_id
                GROUP BY p.products_name
                ORDER BY Total_Revenue DESC";

                _context.Database.OpenConnection();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            ProductsName = reader.GetString(0),
                            TotalRevenue = reader.GetDecimal(1),
                            UnitsSold = reader.GetDecimal(2)
                        });
                    }
                }
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("sales_per_month")]
        public IActionResult GetSalesPerMonth()
        {
            var result = new List<object>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                SELECT 
                    FORMAT(sales_created, 'yyyy-MM') as Month,
                    SUM(sales_total_price) as Revenue
                FROM sales 
                GROUP BY FORMAT(sales_created, 'yyyy-MM')
                ORDER BY Month;";

                _context.Database.OpenConnection();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            Month = reader.GetString(0),
                            Revenue = reader.GetDecimal(1)
                        });
                    }
                }
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("revenue_per_category")]
        public IActionResult GetRevenuePerCategory()
        {
            var result = new List<object>();

            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                SELECT 
                    c.category_name,
                    COUNT(s.sales_id) as Order_Count,
                    SUM(s.sales_total_price) as Total_Revenue
                FROM sales s
                JOIN products p ON s.sales_product_id = p.products_id
                JOIN category c ON p.products_category_id = c.category_id
                GROUP BY c.category_name
                ORDER BY Total_Revenue DESC;";

                _context.Database.OpenConnection();

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new
                        {
                            category_name = reader.GetString(0),
                            order_count = reader.GetInt32(1),
                            total_revenue = reader.GetDecimal(2)
                        });
                    }
                }
            }

            return Ok(result);
        }
    }
}
