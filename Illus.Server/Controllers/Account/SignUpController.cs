using Illus.Server.Models.Command;
using Illus.Server.Sservices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly LoginService _loginService;
        public SignUpController(LoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public IActionResult SignUp(LoginCommand command)
        {
            var result = new SignUpResult();
            if (
                string.IsNullOrEmpty(command.Account) ||
                string.IsNullOrEmpty(command.Password) ||
                string.IsNullOrEmpty(command.Email) ||
                !command.Email.Contains("@")
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
                result = _loginService.SignUp(command);
            }

            return Ok(result);
        }

        [HttpGet("{CAPTCHA}")]
        public IActionResult Confirm(Guid CAPTCHA)
        {
            var result = new SignUpResult();
            if (CAPTCHA == Guid.Empty)
            {
                result.Success = false;
                result.Error = "NO DATA";
            }
            else
            {
                result = _loginService.Comfirm(CAPTCHA);
            }

            return Ok(result);
        }
        [HttpGet("confirmAgain/{CAPTCHA}")]
        public IActionResult ConfirmAgain(Guid CAPTCHA)
        {
            var result = new SignUpResult();
            if (CAPTCHA == Guid.Empty)
            {
                result.Success = false;
                result.Error = "CAPTCHA IS NULL";
            }
            else
            {
                result = _loginService.ConfirmAgain(CAPTCHA);
            }
            return Ok(result);
        }
    }
}
