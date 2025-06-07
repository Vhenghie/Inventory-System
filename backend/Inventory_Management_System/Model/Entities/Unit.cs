using System.ComponentModel.DataAnnotations;

namespace Inventory_Management_System.Model.Entities
{
    public class Unit
    {
        [Key]
        public int unit_id { get; set; }
        public string unit_name { get; set; }
        public ICollection<Product>? Products { get; set; }
    }
}
