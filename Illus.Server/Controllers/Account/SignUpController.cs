using Illus.Server.Models.Command;
using Illus.Server.Sservices.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Illus.Server.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignUpController : ControllerBase
    {
        private readonly LoginService _loginService;
        private readonly string _loginTokenKey;
        private readonly string _userIdKey;
        public SignUpController(LoginService loginService)
        {
            _loginService = loginService;
            _loginTokenKey = "LoginToken";
            _userIdKey = "UserId";
        }

        [HttpPost]
        public IActionResult SignUp(LoginCommand command)
        {
            var result = new SignUpResult();
            if (
                string.IsNullOrWhiteSpace(command.Account) ||
                string.IsNullOrWhiteSpace(command.Password) ||
                string.IsNullOrWhiteSpace(command.Email) ||
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
                var confirmData = _loginService.Comfirm(CAPTCHA);

                //將成功資訊直接傳回前端
                result.Success = confirmData.Success;
                result.Error = confirmData.Error;

                if (confirmData.Success)
                {
                    //將使用者資訊寫入cookie
                    HttpContext.Response.Cookies.Append(_loginTokenKey, confirmData.Token.ToString()!, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                    HttpContext.Response.Cookies.Append(_userIdKey, confirmData.UserId.ToString()!, new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                }
            }

            return (result.Success) ? Ok() : BadRequest();
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
