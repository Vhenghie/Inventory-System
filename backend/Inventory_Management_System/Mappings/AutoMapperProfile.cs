using System.Diagnostics;
using AutoMapper;
using Inventory_Management_System.Model;
using Inventory_Management_System.Model.DTO.Category;
using Inventory_Management_System.Model.DTO.InventoryMovement;
using Inventory_Management_System.Model.DTO.Product;
using Inventory_Management_System.Model.DTO.Unit;
using Inventory_Management_System.Model.DTO.User;
using Inventory_Management_System.Model.DTO.Sale;
using Inventory_Management_System.Model.Entities;

namespace Inventory_Management_System.Mappings
{
    public class AutoMapperProfile : Profile
    {
        
        public AutoMapperProfile()
        {
            CreateMap<UpdateProductDTO, Product>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateCategoryDTO, Category>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateUnitDTO, Unit>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null || srcMember == null));

            CreateMap<UpdateInventoryMovementDTO, InventoryMovement>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateUserDTO, User>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<UpdateSaleDTO, Sale>()
              .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

        }

    }
}
