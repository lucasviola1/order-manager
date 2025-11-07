using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OrderApi.Data;
using OrderApi.Domain;
using OrderApi.Services;

namespace OrderProcess.Worker
{
    public class OrderWorker : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly IMessageQueue _queue;

        public OrderWorker(IServiceProvider services, IMessageQueue queue)
        {
            _services = services;
            _queue = queue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_queue.TryDequeue(out var orderId))
                {
                    using var scope = _services.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
                    var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

                    if (order == null || order.Status != OrderStatus.Pendente)
                        continue;

                    order.Status = OrderStatus.Processando;
                    await db.SaveChangesAsync();

                    await Task.Delay(5000, stoppingToken);

                    order.Status = OrderStatus.Finalizado;
                    await db.SaveChangesAsync();
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
