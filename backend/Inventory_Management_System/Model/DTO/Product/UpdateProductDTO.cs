namespace Inventory_Management_System.Model.DTO.Product
{
    public class UpdateProductDTO
    {
        public string products_name { get; set; }
        public int products_category_id { get; set; }
        public int products_unit_id { get; set; }
        public decimal products_price { get; set; }
    }
}
