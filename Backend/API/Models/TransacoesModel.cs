using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class TransacoesModel
    {
        public int Id { get; set; }
        [Required]
        public string Descricao { get; set; }
        [Required]
        public decimal Valor { get; set; }
        [Required]
        public string Tipo { get; set; }
        [Required]
        public int IdCategoria { get; set; }
        [Required]
        public int IdPessoa { get; set; }
    }
}
