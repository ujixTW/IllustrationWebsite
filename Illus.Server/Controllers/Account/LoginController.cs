using Illus.Server.Models.Command;
using Illus.Server.Sservices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Account
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
            var result = new SignUpResult();

            if ((string.IsNullOrEmpty(command.Account) && string.IsNullOrEmpty(command.Email)) ||
                (!string.IsNullOrEmpty(command.Email) && !command.Email.Contains("@")) ||
                string.IsNullOrEmpty(command.Password)
              )
            {
                result.Success = false;
                result.Error = "DATA NOT ENOUGH";
            }
            else
            {
                var token = _loginService.Login(command);
                if (token != null)
                {
                    HttpContext.Response.Cookies.Append("LoginToken", "");
                }
                else
                {
                    result.Success = false;
                    result.Error = "NO USER";
                }
            }
            return Ok(result);
        }


    }
}
