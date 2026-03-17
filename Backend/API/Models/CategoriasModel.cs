using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class CategoriasModel
    {
        public int Id { get; set; }
        [Required]
        public string Descricao { get; set; }
        [Required]
        public string Finalidade { get; set; }
    }

    public class GeralCategoria
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public decimal TotalReceita { get; set; }
        public decimal TotalDespesa { get; set; }
        public decimal Saldo { get; set; }
    }
}
