using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderApi.Data;
using OrderApi.Domain;
using OrderApi.Services;

namespace OrderApi.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersDbContext _db;
        private readonly IMessageQueue _queue;

        public OrdersController(OrdersDbContext db, IMessageQueue queue)
        {
            _db = db;
            _queue = queue;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order order)
        {
            order.Status = OrderStatus.Pendente;
            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            _queue.Enqueue(order.Id); // envia para fila local
            return Ok(order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _db.Orders.ToListAsync();
            return Ok(orders);
        }
    }
}
