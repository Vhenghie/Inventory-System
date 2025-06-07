using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inventory_Management_System.Model.Entities
{
    public class Product
    {
        [Key]
        public int products_id { get; set; }
        public string products_name { get; set; }
        [ForeignKey(nameof(Category))]
        public int? products_category_id { get; set; }
        [ForeignKey(nameof(Unit))]
        public int? products_unit_id { get; set; }
        public decimal products_price { get; set; }
        public decimal? products_stock_quantity { get; set; }

        public virtual Category? Category { get; set; }
        public virtual Unit? Unit { get; set; }
    }
}
