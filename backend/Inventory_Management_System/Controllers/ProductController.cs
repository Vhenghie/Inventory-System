using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Product;
using Inventory_Management_System.Model.DTO.Unit;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory_Management_System.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProductController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getProduct()
        {
            var result = _context.products
                .Include(s => s.Category)
                .Include(s => s.Unit)
                .Select(s => new
                {
                    products_id = s.products_id,
                    products_name = s.products_name,
                    products_category_id = s.products_category_id,
                    products_category = s.Category.category_name,
                    products_unit_id = s.products_unit_id,
                    products_unit = s.Unit.unit_name,
                    products_price = s.products_price,
                    products_stock_quantity = s.products_stock_quantity,
                });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getProductById(int id)
        {
            var result = _context.products
                .Include(s => s.Category)
                .Include(s => s.Unit)
                .Where(s => s.products_id == id)
                .Select(s => new
                {
                    products_id = s.products_id,
                    products_name = s.products_name,
                    products_category_id = s.products_category_id,
                    products_category = s.Category.category_name,
                    products_unit_id = s.products_unit_id,
                    products_unit = s.Unit.unit_name,
                    products_price = s.products_price,
                    products_stock_quantity = s.products_stock_quantity,
                })
                .FirstOrDefault();

            if (result == null)
                return NotFound("Sale not found.");

            return Ok(result);
        }

        [HttpPost]
        public IActionResult createProduct(CreateProductDTO createDTO)
        {
            try
            {
                var entity = new Product
                {
                    products_name = createDTO.products_name,
                    products_category_id = createDTO.products_category_id,
                    products_unit_id = createDTO.products_unit_id,
                    products_price = createDTO.products_price,
                    products_stock_quantity = createDTO.products_stock_quantity
                };

                _context.products.Add(entity);
                _context.SaveChanges();

                if (createDTO.products_stock_quantity > 0)
                {
                    var movement = new InventoryMovement
                    {
                        inventory_movement_product_id = entity.products_id,
                        inventory_movement_type = "In",
                        inventory_movement_quantity = createDTO.products_stock_quantity,
                        inventory_movement_notes = "Initial stock on product creation"
                    };

                    _context.inventory_movement.Add(movement);
                    _context.SaveChanges();
                }

                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Product: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateProduct(int id, [FromBody] UpdateProductDTO updateDTO)
        {
            try
            {
                var entity = _context.products.Find(id);
                if (entity == null) return NotFound("Product not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Product: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                var ent = _context.products.Find(id);

                if (ent == null) return NotFound("Product not found");

                _context.products.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Product: {ex.Message}");
            }
        }
    }
}
