using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory_Management_System.Model.Entities
{
    public class InventoryMovement
    {
        [Key]
        public int inventory_movement_id { get; set; }
        [ForeignKey(nameof(Product))]
        public int inventory_movement_product_id { get; set; }
        public string inventory_movement_type { get; set; }
        public decimal inventory_movement_quantity { get; set; }
        public string inventory_movement_notes { get; set; }
        public DateTime? inventory_movement_date { get; set; }
        public virtual Product? Product { get; set; }
    }
}
