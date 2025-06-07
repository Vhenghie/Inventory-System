using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Inventory_Management_System.Model.Entities
{
    public class User
    {
        [Key]
        public int users_id { get; set; }
        public string users_name { get; set; }
        public string users_email { get; set; }
        public string users_password { get; set; }
        public bool users_isactive { get; set; }
        public DateTime users_created { get; set; }

    }
}
