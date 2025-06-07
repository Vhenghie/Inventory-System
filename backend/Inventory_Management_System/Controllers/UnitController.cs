using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.Unit;
using Inventory_Management_System.Model.DTO.User;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory_Management_System.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UnitController(AppDbContext dbContext, IMapper mapper)
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getUnit()
        {
            var result = _context.unit.ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getUnitById(int id)
        {
            var result = _context.unit.Find(id);
            if (result is null) return NotFound("Unit not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createUnit(CreateUnitDTO createDTO)
        {
            try
            {
                var entity = new Unit
                {
                    unit_name = createDTO.unit_name
                };

                _context.unit.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating Unit: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateUnit(int id, [FromBody] UpdateUnitDTO updateDTO)
        {
            try
            {
                var entity = _context.unit.Find(id);
                if (entity == null) return NotFound("Unit not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating Unit: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUnit(int id)
        {
            try
            {
                var ent = _context.unit.Find(id);

                if (ent == null) return NotFound("Unit not found");

                _context.unit.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting Unit: {ex.Message}");
            }
        }
    }
}
