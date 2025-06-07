using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using Inventory_Management_System.Model.Entities;

namespace Inventory_Management_System.Data
{
    public class AppDbContext :DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Category> category { get; set; }
        public DbSet<InventoryMovement> inventory_movement { get; set; }
        public DbSet<Product> products { get; set; }
        public DbSet<Unit> unit { get; set; }
        public DbSet<User> users { get; set; }
        public DbSet<Sale> sales { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.products_category_id);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Unit)
                .WithMany(u => u.Products)
                .HasForeignKey(p => p.products_unit_id);
        }
    }
}
