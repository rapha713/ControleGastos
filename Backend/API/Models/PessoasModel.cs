using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    //O model é um espelho da estrutura da tabela no banco de dados,
    //onde cada propriedade representa uma coluna da tabela Pessoas
    public class PessoasModel
    {
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        [Required]
        public int Idade { get; set; }
    }

    public class PessoaUpdate
    {
        public string Nome { get; set; }
        public int Idade { get; set; }
    }

    public class GeralPessoa
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal TotalReceita { get; set; }
        public decimal TotalDespesa { get; set; }
        public decimal Saldo { get; set; }
    }
}
