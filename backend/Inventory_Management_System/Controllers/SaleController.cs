using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Product;
using Inventory_Management_System.Model.DTO.Sale;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory_Management_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public SaleController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getSales()
        {
            var result = _context.sales
                .Include(s => s.Product)
                    .ThenInclude(p => p.Category)
                .Include(s => s.Product)
                    .ThenInclude(p => p.Unit)
                .Select(s => new
                {
                    sales_id = s.sales_id,
                    sales_description = s.sales_description,
                    sales_product_id = s.sales_product_id,
                    sales_product_name = s.Product.products_name,
                    sales_product_price = s.Product.products_price,
                    sales_product_category_id = s.Product.products_category_id,
                    sales_product_category = s.Product.Category.category_name,
                    sales_product_unit_id = s.Product.products_unit_id,
                    sales_product_unit = s.Product.Unit.unit_name,
                    sales_unit_value = s.sales_unit_value,
                    sales_total_price = s.sales_total_price,
                    sales_created = s.sales_created
                });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getSalesById(int id)
        {
            var result = _context.sales
                .Include(s => s.Product)
                    .ThenInclude(p => p.Category)
                .Include(s => s.Product)
                    .ThenInclude(p => p.Unit)
                .Where(s => s.sales_id == id)
                .Select(s => new
                {
                    sales_id = s.sales_id,
                    sales_description = s.sales_description,
                    sales_product_id = s.sales_product_id,
                    sales_product_name = s.Product.products_name,
                    sales_product_category_id = s.Product.products_category_id,
                    sales_product_category = s.Product.Category.category_name,
                    sales_product_unit_id = s.Product.products_unit_id,
                    sales_product_unit = s.Product.Unit.unit_name,
                    sales_product_price = s.Product.products_price,
                    sales_unit_value = s.sales_unit_value,
                    sales_total_price = s.sales_total_price,
                    sales_created = s.sales_created
                })
                .FirstOrDefault();

            if (result == null)
                return NotFound("Sale not found.");

            return Ok(result);
        }

        [HttpPost]
        public IActionResult createSales(CreateSaleDTO createDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var product = _context.products.FirstOrDefault(p => p.products_id == createDTO.sales_product_id);

                    if (product == null)
                        return NotFound(new { error = "Product not found." });

                    if (product.products_stock_quantity < (decimal)createDTO.sales_unit_value)
                        return BadRequest(new { error = "Not enough stock available." });

                    var entity = new Sale
                    {
                        sales_description = createDTO.sales_description,
                        sales_product_id = createDTO.sales_product_id,
                        sales_unit_value = createDTO.sales_unit_value,
                        sales_total_price = createDTO.sales_total_price,
                        sales_created = DateTime.Now
                    };

                    _context.sales.Add(entity);

                    product.products_stock_quantity -= (decimal)createDTO.sales_unit_value;

                    var movement = new InventoryMovement
                    {
                        inventory_movement_product_id = createDTO.sales_product_id,
                        inventory_movement_type = "Out",
                        inventory_movement_quantity = (decimal)createDTO.sales_unit_value,
                        inventory_movement_notes = $"Sale: {createDTO.sales_description}",
                        inventory_movement_date = DateTime.Now,
                    };

                    _context.inventory_movement.Add(movement);

                    _context.SaveChanges();
                    transaction.Commit();
                    return Ok(entity);

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"Error creating Sale: {ex.Message}");
                }
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateSales(int id, [FromBody] UpdateSaleDTO updateDTO)
        {
            try
            {
                var entity = _context.sales.Find(id);
                if (entity == null) return NotFound("Sales not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Sale: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSale(int id)
        {
            try
            {
                var ent = _context.sales.Find(id);

                if (ent == null) return NotFound("Sale not found");

                _context.sales.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Sale: {ex.Message}");
            }
        }
    }
}
