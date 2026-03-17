using API.Services;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PessoasController : Controller
    {
        private readonly PessoasService _pessoasService;

        public PessoasController(PessoasService pessoasService)
        {
            _pessoasService = pessoasService;
        }

        [HttpGet("listarPessoas")]
        public async Task<IActionResult> ListarPessoas()
        {
            var pessoas = await _pessoasService.GetPessoas();
            return Ok(pessoas);
        }

        [HttpPost("cadastrarPessoas")]
        public async Task<IActionResult> CadastrarPessoas(string nome, int idade)
        {
            var insert = await _pessoasService.AddPessoas(nome, idade);

            if (insert == null)
                return Ok(new { success = true });
            else
                return BadRequest(new { success = false, error = insert });
        }

        [HttpPut("atualizarPessoas/{id}")]
        public async Task<IActionResult> AtualizarPessoas(int id, [FromBody] PessoaUpdate request)
        {
            var update = await _pessoasService.UpdatePessoas(id, request.Nome, request.Idade);

            if (update == null)
                return Ok(new { success = true });
            else
                return BadRequest(new { success = false, error = update });
        }

        [HttpDelete("deletarPessoas/{id}")]
        public async Task<IActionResult> DeletarPessoas(int id)
        {
            var delete = await _pessoasService.DeletePessoas(id);

            if (delete == null)
                return Ok(new { success = true });
            else
                return BadRequest(new { success = false, error = delete });
        }

        [HttpGet("consultaPessoas")]
        public async Task<IActionResult> ConsultaPessoas()
        {
            var consulta = await _pessoasService.ConsultaPessoas();
            return Ok(consulta);
        }
    }
}
