using API.Services;
using Microsoft.Data.SqlClient;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Configuração de CORS (Cross-Origin Resource Sharing) para permitir solicitações de qualquer origem, método e cabeçalho
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() //Qualquer origem
              .AllowAnyMethod() //Qualquer método HTTP (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader(); //Qualquer cabeçalho (Authorization, Content-Type, etc.)
    });
});

// Registro de controladores, responsáveis por lidar com as requisições HTTP
builder.Services.AddControllers();

// Registro de serviços
builder.Services.AddTransient<PessoasService>(provider => //Registra o serviço para injeção de dependência, 'AddTransient' indica que uma nova instância do serviço será criada cada vez que for solicitado
{
    var configuration = provider.GetRequiredService<IConfiguration>(); //Obtém a configuração do appsettings.json ou de outras fontes de configuração
    string sqlServerConnectionString = configuration.GetConnectionString("Db"); //Lê a string de conexão do banco de dados SQL Server
    var logger = provider.GetRequiredService<ILogger<PessoasService>>(); //Obtém um logger para a classe
    return new PessoasService(sqlServerConnectionString, logger); //Cria e retorna uma nova instância do serviço com a string de conexão e o logger
});

builder.Services.AddTransient<CategoriasService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    string sqlServerConnectionString = configuration.GetConnectionString("Db");
    var logger = provider.GetRequiredService<ILogger<CategoriasService>>();
    return new CategoriasService(sqlServerConnectionString, logger);
});

builder.Services.AddTransient<TransacoesService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    string sqlServerConnectionString = configuration.GetConnectionString("Db");
    var logger = provider.GetRequiredService<ILogger<TransacoesService>>();
    return new TransacoesService(sqlServerConnectionString, logger);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();