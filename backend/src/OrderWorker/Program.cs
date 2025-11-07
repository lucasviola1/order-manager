using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OrderApi.Data;
using OrderApi.Services;
using OrderProcess.Worker;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        var conn = context.Configuration.GetConnectionString("DefaultConnection")
            ?? "Host=localhost;Port=5432;Database=teste;Username=postgres;Password=root";

        services.AddDbContext<OrdersDbContext>(opt => opt.UseNpgsql(conn));
        services.AddSingleton<IMessageQueue, LocalMessageQueue>();
        services.AddHostedService<OrderWorker>();
    })
    .Build();

host.Run();
