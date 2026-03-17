using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransacoesController : Controller
    {
        private readonly TransacoesService _transacoesService;

        public TransacoesController(TransacoesService transacoesService)
        {
            _transacoesService = transacoesService;
        }

        [HttpGet("listarTransacoes")]
        public async Task<IActionResult> ListarTransacoes()
        {
            var transacoes = await _transacoesService.GetTransacoes();
            return Ok(transacoes);
        }

        [HttpPost("cadastrarTransacoes")]
        public async Task<IActionResult> CadastrarTransacoes(string descricao, decimal valor, string tipo, int idCategoria, int idPessoa)
        {
            var insert = await _transacoesService.AddTransacao(descricao, valor, tipo, idCategoria, idPessoa);
            if (insert == null)
                return Ok(new { success = true });
            else
                return BadRequest(new { success = false, error = insert });
        }
    }
}
