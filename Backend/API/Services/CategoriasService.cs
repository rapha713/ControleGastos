using API.Models;
using System.Collections.Generic;
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace API.Services
{
    public class CategoriasService
    {
        private readonly string _sqlServerConnectionString;
        private readonly ILogger<CategoriasService> _logger;

        public CategoriasService(string sqlServerConnectionString, ILogger<CategoriasService> logger)
        {
            _sqlServerConnectionString = sqlServerConnectionString;
            _logger = logger;
        }

        public async Task<string?> AddCategorias(string descricao, string finalidade)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    INSERT INTO Categorias (Descricao, Finalidade)
                    VALUES (@Descricao, @Finalidade)";

                    var parameters = new
                    {
                        Descricao = descricao,
                        Finalidade = finalidade
                    };

                    var insert = await dbConnection.ExecuteAsync(sqlQuery, parameters);

                    if (insert > 0)
                        return null;
                    return "Nenhuma linha foi inserida.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving categoria to database");
                return ex.Message;
            }
        }

        public async Task<List<CategoriasModel>> GetCategorias()
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = "SELECT * FROM Categorias";

                    var categorias = await dbConnection.QueryAsync<CategoriasModel>(sqlQuery);

                    return categorias.ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categorias from database");
                return new List<CategoriasModel>();
            }
        }

        public async Task<List<GeralCategoria>> ConsultaCategorias()
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    SELECT c.Id, c.Descricao,
                        SUM(CASE 
                            WHEN t.Tipo = 'Receita' THEN t.Valor 
                            ELSE 0 
                        END) AS TotalReceita,
                        SUM(CASE 
                            WHEN t.Tipo = 'Despesa' THEN t.Valor 
                            ELSE 0 
                        END) AS TotalDespesa,
                        SUM(CASE 
                            WHEN t.Tipo = 'Receita' THEN t.Valor 
                            WHEN t.Tipo = 'Despesa' THEN -t.Valor
                            ELSE 0
                        END) AS Saldo
                    FROM Categorias c
                    LEFT JOIN Transacoes t ON t.IdCategoria = c.Id
                    GROUP BY c.Id, c.Descricao";

                    var consulta = await dbConnection.QueryAsync<GeralCategoria>(sqlQuery);

                    return consulta.ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving categorias from database");
                return new List<GeralCategoria>();
            }
        }
    }
}
