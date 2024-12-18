using Illus.Server.Domain;
using Illus.Server.Services;
using Microsoft.EntityFrameworkCore;

//CORS跨來源請求
var IllusClientPolicy = "_illusClientPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//CORS跨來源請求
builder.Services.AddCors(options =>
{
    options.AddPolicy(IllusClientPolicy, policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

//連接DB
builder.Services.AddDbContext<IllusContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IllusContext")));

AddServicesScoped.AddScopeds(builder.Services);

builder.Services.AddControllers();
builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS跨原始來源請求
app.UseCors(IllusClientPolicy);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
