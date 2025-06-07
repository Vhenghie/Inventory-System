namespace Inventory_Management_System.Model.DTO.User
{
    public class UpdateUserDTO
    {
        public string users_name { get; set; }
        public string users_email { get; set; }
        public string users_password { get; set; }
        public bool users_isactive { get; set; }
    }
}
