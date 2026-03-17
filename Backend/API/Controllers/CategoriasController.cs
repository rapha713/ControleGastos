using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriasController : Controller
    {
        private readonly CategoriasService _categoriasService;
        public CategoriasController(CategoriasService categoriasService)
        {
            _categoriasService = categoriasService;
        }

        [HttpGet("listarCategorias")]
        public async Task<IActionResult> ListarCategorias()
        {
            var categorias = await _categoriasService.GetCategorias();
            return Ok(categorias);
        }

        [HttpPost("cadastrarCategorias")]
        public async Task<IActionResult> CadastrarCategorias(string descricao, string finalidade)
        {
            var insert = await _categoriasService.AddCategorias(descricao, finalidade);
            if (insert == null)
                return Ok(new { success = true });
            else
                return BadRequest(new { success = false, error = insert });
        }

        [HttpGet("consultaCategorias")]
        public async Task<IActionResult> ConsultaCategorias()
        {
            var consulta = await _categoriasService.ConsultaCategorias();
            return Ok(consulta);
        }
    }
}
