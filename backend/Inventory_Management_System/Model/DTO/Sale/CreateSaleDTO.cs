namespace Inventory_Management_System.Model.DTO.Sale
{
    public class CreateSaleDTO
    {
        public string sales_description { get; set; }
        public int sales_product_id { get; set; }
        public decimal sales_unit_value { get; set; }
        public decimal sales_total_price { get; set; }
        public DateTime sales_created { get; set; } = DateTime.Now;
    }
}
