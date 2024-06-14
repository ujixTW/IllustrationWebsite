using Illus.Server.Models.Command;
using Illus.Server.Sservices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LoginService _loginService;
        public LoginController(LoginService loginService)
        {
            _loginService = loginService;
        }
        [HttpPost]
        public IActionResult Login(LoginCommand command)
        {

            return Ok();
        }
        [HttpPost]
        public IActionResult SignUp(LoginCommand command)
        {
            var result = new SignUpResult();
            if (
                string.IsNullOrEmpty(command.Account) ||
                string.IsNullOrEmpty(command.Password) ||
                string.IsNullOrEmpty(command.Email)
                )
            {
                result.Success = false;
                result.Error = "DATA ARE NOT ENOUGH";
            }
            else if (command.Password.Length < 6 || command.Password.Length > 32)
            {
                result.Success = false;
                result.Error = "PASWORD LENGTH IS NON STANDARD";
            }
            else if (command.Account.Length < 6 || command.Account.Length > 16)
            {
                result.Success = false;
                result.Error = "ACCOUNT LENGTH IS NON STANDARD";
            }
            else
            {
                _loginService.SignUp(command);
            }

            return Ok(result);
        }
    }
}
