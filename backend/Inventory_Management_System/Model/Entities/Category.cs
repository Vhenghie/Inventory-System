using System.ComponentModel.DataAnnotations;

namespace Inventory_Management_System.Model.Entities
{
    public class Category
    {
        [Key]
        public int category_id { get; set; }
        public string category_name { get; set; }
        public ICollection<Product>? Products { get; set; }
    }
}
