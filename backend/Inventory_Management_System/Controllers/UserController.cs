using AutoMapper;
using Inventory_Management_System.Data;
using Inventory_Management_System.Model.DTO.User;
using Inventory_Management_System.Model.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace Inventory_Management_System.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserController(AppDbContext dbContext, IMapper mapper) 
        {
            this._context = dbContext;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult getUser()
        {
            var result = _context.users.ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult getUserById(int id)
        {
            var result = _context.users.Find(id);
            if (result is null) return NotFound("User not found!");
            return Ok(result);
        }

        [HttpPost]
        public IActionResult createUser(CreateUserDTO createDTO)
        {
            try
            {
                var entity = new User
                {
                    users_name = createDTO.users_name,
                    users_email = createDTO.users_email,
                    users_password = BCrypt.Net.BCrypt.HashPassword(createDTO.users_password),
                    users_isactive = createDTO.users_isactive,
                    users_created = createDTO.users_created
                };

                _context.users.Add(entity);
                _context.SaveChanges();
                return Ok(entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating User: {ex.Message}");
            }
        }

        [HttpPatch("{id}")]
        public IActionResult updateUser(int id, [FromBody] UpdateUserDTO updateDTO)
        {
            try
            {
                var entity = _context.users.Find(id);
                if (entity == null) return NotFound("User not found");

                _mapper.Map(updateDTO, entity);
                _context.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {

                return StatusCode(500, $"Error updating User: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var ent = _context.users.Find(id);

                if (ent == null) return NotFound("User not found");

                _context.users.Remove(ent);
                _context.SaveChanges();
                return Ok(ent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting User: {ex.Message}");
            }
        }
    }
}
