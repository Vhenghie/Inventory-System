namespace Inventory_Management_System.Model.DTO.InventoryMovement
{
    public class CreateInventoryMovementDTO
    {
        public int inventory_movement_product_id { get; set; }
        public string inventory_movement_type { get; set; }
        public decimal inventory_movement_quantity { get; set; }
        public string inventory_movement_notes { get; set; }
        public DateTime inventory_movement_date { get; set; } = DateTime.Now;
    }
}
