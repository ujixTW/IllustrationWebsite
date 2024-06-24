using Illus.Server.Domain;
using Illus.Server.Sservices.Account;
using Microsoft.EntityFrameworkCore;

//CORS��ӷ��ШD
var IllusClientPolicy = "_illusClientPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//CORS��ӷ��ШD
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

//�s��DB
builder.Services.AddDbContext<IllusContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IllusContext")));

builder.Services.AddScoped<LoginService>();
builder.Services.AddScoped<EditAccountService>();

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

// CORS���l�ӷ��ШD
app.UseCors(IllusClientPolicy);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
