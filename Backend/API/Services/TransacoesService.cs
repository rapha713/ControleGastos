using API.Models;
using System.Collections.Generic;
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace API.Services
{
    public class TransacoesService
    {
        private readonly string _sqlServerConnectionString;
        private readonly ILogger<TransacoesService> _logger;

        public TransacoesService(string sqlServerConnection, ILogger<TransacoesService> logger)
        {
            _sqlServerConnectionString = sqlServerConnection;
            _logger = logger;
        }

        public async Task<string?> AddTransacao(string descricao, decimal valor, string tipo, int idCategoria, int idPessoa)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    INSERT INTO Transacoes (Descricao, Valor, Tipo, IdCategoria, IdPessoa, DataCadastro)
                    VALUES (@Descricao, @Valor, @Tipo, @IdCategoria, @IdPessoa, GETDATE())";

                    var parameters = new
                    {
                        Descricao = descricao,
                        Valor = valor,
                        Tipo = tipo,
                        IdCategoria = idCategoria,
                        IdPessoa = idPessoa
                    };
                    var insert = await dbConnection.ExecuteAsync(sqlQuery, parameters);

                    if (insert > 0)
                        return null;
                    return "Nenhuma linha foi inserida.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving transacao to database");
                return ex.Message;
            }
        }

        public async Task<List<TransacoesModel>> GetTransacoes()
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = "SELECT * FROM Transacoes";
                    var transacoes = await dbConnection.QueryAsync<TransacoesModel>(sqlQuery);
                    return transacoes.ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving transacoes from database");
                return new List<TransacoesModel>();
            }
        }
    }
}
