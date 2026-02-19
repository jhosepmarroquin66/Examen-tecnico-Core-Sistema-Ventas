using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SistemaVentas.Data;
using SistemaVentas.Core.Interfaces;
using SistemaVentas.Services.Implementations;
using SistemaVentas.Services.Decorators;
using SistemaVentas.Services.Facades;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =============================================================
// 1. CONFIGURACIÓN DE SEGURIDAD (JWT)
// =============================================================
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "ClaveSuperSecretaDeAlMenos32Caracteres");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });

// =============================================================
// 2. CONFIGURACIÓN DE CORS (UNIFICADA)
// =============================================================
builder.Services.AddCors(options => {
    options.AddPolicy("PermitirTodo", policy => {
        policy.WithOrigins("http://localhost:5173") // TU PUERTO DE REACT
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// =============================================================
// 3. REGISTRO DE SERVICIOS
// =============================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Sistema Ventas API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Escribe: 'Bearer [tu_token]'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddSingleton<DapperContext>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ProductoService>();
builder.Services.AddScoped<IProductoService>(provider =>
{
    var service = provider.GetRequiredService<ProductoService>();
    var logger = provider.GetRequiredService<ILogger<ProductoLoggingDecorator>>();
    return new ProductoLoggingDecorator(service, logger);
});

builder.Services.AddScoped<IVentaFacade, VentaFacade>();
builder.Services.AddScoped<ICompraFacade, CompraFacade>();
builder.Services.AddScoped<IKardexService, KardexService>();
builder.Services.AddScoped<IMovimientoService, MovimientoService>();

var app = builder.Build();

// =============================================================
// 4. PIPELINE DE LA APLICACIÓN (ORDEN CRÍTICO)
// =============================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANTE: UseCors debe ir ANTES de Authentication y Authorization
app.UseCors("PermitirTodo");

app.UseAuthentication();
app.UseMiddleware<SistemaVentas.Middleware.ErrorResponseMiddleware>();
app.UseAuthorization();

app.MapControllers();
app.Run();