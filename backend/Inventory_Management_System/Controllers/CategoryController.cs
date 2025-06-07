using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Category;
using Inventory_Management_System.Model.DTO.Unit;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory_Management_System.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CategoryController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getCategory()
        {
            var result = _context.category.ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getCategoryById(int id)
        {
            var result = _context.category.Find(id);
            if (result is null) return NotFound("Category not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createCategory(CreateCategoryDTO createDTO)
        {
            try
            {
                var entity = new Category
                {
                    category_name = createDTO.category_name
                };

                _context.category.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Category: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateCategory(int id, [FromBody] UpdateCategoryDTO updateDTO)
        {
            try
            {
                var entity = _context.category.Find(id);
                if (entity == null) return NotFound("Category not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Category: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            try
            {
                var ent = _context.category.Find(id);

                if (ent == null) return NotFound("Category not found");

                _context.category.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Category: {ex.Message}");
            }
        }
    }
}
