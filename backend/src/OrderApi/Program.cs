using Microsoft.EntityFrameworkCore;
using OrderApi.Data;
using OrderApi.Services;

var builder = WebApplication.CreateBuilder(args);

 builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAllPolicy",
            builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
    });


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var conn = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=novoteste;Username=postgres;Password=root";

builder.Services.AddDbContext<OrdersDbContext>(opt => opt.UseNpgsql(conn));
builder.Services.AddSingleton<IMessageQueue, LocalMessageQueue>();

builder.Services.AddHealthChecks()
    .AddNpgSql(conn, name: "postgres");

var app = builder.Build();

  app.UseCors("AllowAllPolicy");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();
    db.Database.Migrate();
}
app.UseHttpsRedirection();
    app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

 

app.UseSwagger();
app.UseSwaggerUI();

app.Run();
