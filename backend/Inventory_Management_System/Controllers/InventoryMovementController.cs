using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Product;
using Inventory_Management_System.Model.DTO.Category;
using Inventory_Management_System.Model.DTO.InventoryMovement;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inventory_Management_System.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryMovementController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public InventoryMovementController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getInventoryMovement()
        {
            var result = _context.inventory_movement
                .Include(s => s.Product)
                .Select(s => new
                {
                    inventory_movement_id = s.inventory_movement_id,
                    inventory_movement_product_id = s.Product.products_id,
                    inventory_movement_product_name = s.Product.products_name,
                    inventory_movement_type = s.inventory_movement_type,
                    inventory_movement_quantity = s.inventory_movement_quantity,
                    inventory_movement_notes = s.inventory_movement_notes,
                    inventory_movement_date = s.inventory_movement_date
                });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getInventoryMovementById(int id)
        {
            var result = _context.inventory_movement
                .Include(s => s.Product)
                .Where(s => s.inventory_movement_id == id)
                .Select(s => new
                {
                    inventory_movement_id = s.inventory_movement_id,
                    inventory_movement_product_id = s.Product.products_id,
                    inventory_movement_product_name = s.Product.products_name,
                    inventory_movement_type = s.inventory_movement_type,
                    inventory_movement_quantity = s.inventory_movement_quantity,
                    inventory_movement_notes = s.inventory_movement_notes,
                    inventory_movement_date = s.inventory_movement_date
                })
                .FirstOrDefault();

            if (result is null) 
                return NotFound("Inventory Movement not found!");

            return Ok(result);
        }

        [HttpPost]
        public IActionResult createInventoryMovement(CreateInventoryMovementDTO createDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var product = _context.products.FirstOrDefault(p => p.products_id == createDTO.inventory_movement_product_id);

                    if (product == null)
                        return NotFound(new { error = "Product not found." });

                    var entity = new InventoryMovement
                    {
                        inventory_movement_product_id = createDTO.inventory_movement_product_id,
                        inventory_movement_type = createDTO.inventory_movement_type,
                        inventory_movement_quantity = createDTO.inventory_movement_quantity,
                        inventory_movement_notes = createDTO.inventory_movement_notes,
                        inventory_movement_date = DateTime.Now
                    };

                    if (createDTO.inventory_movement_type == "In")
                    {
                        product.products_stock_quantity += (decimal)createDTO.inventory_movement_quantity;
                    }
                    else if (createDTO.inventory_movement_type == "Out")
                    {
                        product.products_stock_quantity -= (decimal)createDTO.inventory_movement_quantity;
                    }

                    _context.inventory_movement.Add(entity);
                    _context.SaveChanges();
                    transaction.Commit();
                    return Ok(entity);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, $"Error creating Inventory Movement: {ex.Message}");
                }
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateInventoryMovement(int id, [FromBody] UpdateInventoryMovementDTO updateDTO)
        {
            try
            {
                var entity = _context.inventory_movement.Find(id);
                if (entity == null) return NotFound("Inventory Movement not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Inventory Movement: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteInventoryMovement(int id)
        {
            try
            {
                var ent = _context.inventory_movement.Find(id);

                if (ent == null) return NotFound("Inventory Movement not found");

                _context.inventory_movement.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Inventory Movement: {ex.Message}");
            }
        }
    }
}
