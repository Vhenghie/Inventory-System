namespace Inventory_Management_System.Model.DTO.User
{
    public class CreateUserDTO
    {
        public string users_name { get; set; }
        public string users_email { get; set; }
        public string users_password { get; set; }
        public bool users_isactive { get; set; }
        public DateTime users_created { get; set; } = DateTime.UtcNow;
    }
}
