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
            if (command is null || command.Password.Length < 6)
            {
                result.Success = false;
                result.Error = (command is null)?
                     "DATA ARE NOT ENOUGH" :
                     "PASWORD LENGTH IS BELOW SIX";
            }
            else
            {
                _loginService.SignUp(command);
            }

            return Ok(result);
        }
    }
}
