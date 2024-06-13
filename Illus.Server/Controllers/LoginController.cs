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

            return Ok();
        }
    }
}
