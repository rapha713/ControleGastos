using API.Models;
using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace API.Services
{
    public class PessoasService
    {
        //Logger para registrar erros e informações relevantes durante a execução
        private readonly ILogger<PessoasService> _logger;

        //String de conexão com o banco de dados SQL Server
        private readonly string _sqlServerConnectionString;

        //Construtor da classe, onde são injetados a string de conexão e o logger
        public PessoasService(string sqlServerConnectionString, ILogger<PessoasService> logger)
        {
            _sqlServerConnectionString = sqlServerConnectionString;
            _logger = logger;
        }

        public async Task<List<PessoasModel>> GetPessoas() //Listagem de pessoas
        {
            try
            {
                //Criação de uma conexão com o banco de dados usando a string de conexão fornecida
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = "SELECT Id, Nome, Idade FROM Pessoas";

                    //Execução da query SQL para obter os dados da tabela Pessoas usando Dapper
                    var pessoas = await dbConnection.QueryAsync<PessoasModel>(sqlQuery);

                    //Retorna a lista de pessoas obtida do banco de dados
                    return pessoas.ToList();
                }
            }
            catch (Exception ex)
            {
                //Em caso de erro, registra o erro no logger e retorna uma lista vazia
                _logger.LogError(ex, "Error retrieving pessoas from database");
                //Retorna uma lista vazia para evitar que a aplicação quebre devido a um erro na consulta ao banco de dados
                return new List<PessoasModel>();
            }
        }

        public async Task<string?> AddPessoas(string nome, int idade) //Cadastro de pessoas
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    INSERT INTO Pessoas (Nome, Idade, DataCadastro)
                    VALUES (@Nome, @Idade, GETDATE())";

                    //Criação de um objeto anônimo para passar os parâmetros da query SQL
                    var parameters = new
                    {
                        Nome = nome,
                        Idade = idade
                    };

                    var insert = await dbConnection.ExecuteAsync(sqlQuery, parameters);

                    //Verifica se a inserção foi bem-sucedida, ou seja, se pelo menos uma linha foi afetada
                    if (insert > 0)
                        return null;

                    return "Nenhuma linha foi inserida.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving pessoa to database");
                return ex.Message;
            }
        }

        public async Task<string?> UpdatePessoas(int id, string nome, int idade) //Atualizar pessoas
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    UPDATE Pessoas SET Nome = @Nome, Idade = @Idade WHERE Id = @Id";

                    var parameters = new
                    {
                        id,
                        nome,
                        idade
                    };

                    var update = await dbConnection.ExecuteAsync(sqlQuery, parameters);

                    if (update > 0)
                        return null;

                    return "Nenhuma linha foi inserida.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating pessoa in database");
                return ex.Message;
            }
        }

        public async Task<string?> DeletePessoas(int id) //Deletar pessoas
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = "DELETE FROM Pessoas WHERE Id = @Id";

                    var parameters = new { Id = id };

                    var delete = await dbConnection.ExecuteAsync(sqlQuery, parameters);

                    if (delete > 0)
                        return null;

                    return "Nenhuma linha foi inserida.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting pessoa from database");
                return ex.Message;
            }
        }

        public async Task<List<GeralPessoa>> ConsultaPessoas() //Consulta total por pessoa
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_sqlServerConnectionString))
                {
                    string sqlQuery = @"
                    SELECT p.Id, p.Nome,
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
                    FROM Transacoes t
                    JOIN Pessoas p ON p.Id = t.IdPessoa
                    GROUP BY p.Id, p.Nome";

                    var consulta = await dbConnection.QueryAsync<GeralPessoa>(sqlQuery);

                    return consulta.ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving pessoas from database");
                return new List<GeralPessoa>();
            }
        }
    }
}