using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory_Management_System.Model.Entities
{
    public class Sale
    {
        [Key]
        public int sales_id { get; set; }
        public string sales_description { get; set; }
        [ForeignKey(nameof(Product))]
        public int sales_product_id { get; set; }
        public decimal sales_unit_value { get; set; }
        public decimal sales_total_price { get; set; }
        public DateTime? sales_created { get; set; }

        public virtual Product? Product { get; set; }
    }
}
