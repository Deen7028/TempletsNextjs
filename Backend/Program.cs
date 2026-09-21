using System.Text;
using Backend.Application.Services;
using Backend.Infrastructure.Data.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// เปิดใช้งาน Legacy Timestamp Behavior เพื่อให้ Npgsql บันทึก DateTime (UTC หรือ Local) ลงคอลัมน์ timestamp ได้อย่างราบรื่น
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add services to the container.
var sAllowedOriginsSetting = builder.Configuration["AllowedOrigins"];
string[] lstAllowedOrigins = string.IsNullOrEmpty(sAllowedOriginsSetting) || sAllowedOriginsSetting == "*"
    ? new[] { "http://localhost:3000" }
    : sAllowedOriginsSetting.Split(';', StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy =>
    {
        policy.WithOrigins(lstAllowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Database Connection (PostgreSQL - Neon)
var connectionString = builder.Configuration.GetConnectionString("WebAppConnection")
    ?? throw new InvalidOperationException("Connection string 'WebAppConnection' not found.");
builder.Services.AddDbContext<PoDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// Register Application Services
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// JWT Authentication Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var sJwtKey = jwtSettings["Key"] 
    ?? (builder.Environment.IsDevelopment() ? "YourSuperSecretStrongKeyForJwt1234567890!" : null)
    ?? throw new InvalidOperationException("JWT Key is missing from configuration.");
var key = Encoding.UTF8.GetBytes(sJwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var authorization = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                context.Token = authorization.Substring("Bearer ".Length).Trim();
            }
            else if (context.Request.Cookies.ContainsKey("token"))
            {
                context.Token = context.Request.Cookies["token"];
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();
app.UseCors("AllowNextJs");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { status = "online", message = "PO API is running" }));

app.Run();