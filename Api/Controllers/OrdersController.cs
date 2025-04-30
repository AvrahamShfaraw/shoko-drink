// using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<AccountController> _logger;

        public OrdersController(DataContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogger<AccountController> logger)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _context = context;
        }


        [HttpPost("checkout")]
        public async Task<ActionResult> Checkout([FromBody] OrderDto dto)
        {
            var currentUserPhoneNumber = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.MobilePhone);

            if (string.IsNullOrEmpty(currentUserPhoneNumber))
                return Unauthorized("User is not logged in.");

            var customer = await _context.Users
                .FirstOrDefaultAsync(u => u.PhoneNumber == currentUserPhoneNumber);

            if (customer == null)
                return NotFound("Customer not found.");

            var productIds = dto.Products.Select(p => p.ProductId).ToList();

            var productsFromDb = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync();

            if (productsFromDb.Count != productIds.Count)
                return BadRequest("One or more products not found.");

            var orderProducts = dto.Products.Select(p =>
                new OrderProduct
                {
                    Product = productsFromDb.First(x => x.Id == p.ProductId),
                    Quantity = p.Quantity
                }).ToList();

            // Reduce stock quantities
            foreach (var orderProduct in orderProducts)
            {
                var product = orderProduct.Product;
                if (product.Stock < orderProduct.Quantity)
                {
                    return BadRequest($"Product '{product.Name}' does not have enough stock.");
                }

                product.Stock -= orderProduct.Quantity;
            }

            var order = new Order
            {
                Customer = customer,
                Address = dto.Address,
                Status = "בטיפול",
                TotalPrice = dto.TotalPrice,
                Date = DateTime.UtcNow,
                Products = orderProducts
            };

            await _context.Orders.AddAsync(order);

            // Save updated product stock + new order
            await _context.SaveChangesAsync();

            return Ok(order.Id);
        }
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            var orders = await _context.Orders
            .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
            .AsSplitQuery()
            .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(Guid id)
        {
            var order = await _context.Orders
                .Where(o => o.Id == id)
                .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (order == null) return NotFound();

            return Ok(order);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null) return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("status")]
        public async Task<IActionResult> UpdateStatus([FromBody] OrderDto dto)
        {
            var order = await _context.Orders.FindAsync(dto.Id);

            if (order == null)
                return NotFound("Order not found.");

            order.Status = dto.Status;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully." });
        }

    }
}
