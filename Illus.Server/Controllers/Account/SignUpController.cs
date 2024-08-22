using Illus.Server.Helper;
using Illus.Server.Models;
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

            var accFormatErr = !StringHelper.IsValidAccount(command.Account);
            var pwdFormatErr = !StringHelper.IsValidPassword(command.Password);
            var emailFormatErr = !StringHelper.IsValidEmail(command.Email);
            if (accFormatErr || pwdFormatErr || emailFormatErr)
            {
                if (accFormatErr) result.AccError = (int)SignUpError.Format;
                if (pwdFormatErr) result.PwdError = (int)SignUpError.Format;
                if (emailFormatErr) result.EmailError = (int)SignUpError.Format;
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
            var result = false;
            if (CAPTCHA != Guid.Empty)
            {
                var confirmData = _loginService.Comfirm(CAPTCHA);

                if (confirmData != null)
                {
                    //將使用者資訊寫入cookie
                    HttpContext.Response.Cookies.Append(_loginTokenKey, confirmData.CAPTCHA.ToString(), new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                    HttpContext.Response.Cookies.Append(_userIdKey, confirmData.UserId.ToString(), new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                    result = true;
                }
            }

            return Ok(result);
        }
        [HttpGet("confirmAgain/{CAPTCHA}")]
        public IActionResult ConfirmAgain(Guid CAPTCHA)
        {
            var result = false;
            if (CAPTCHA != Guid.Empty)
            {
                result = _loginService.ConfirmAgain(CAPTCHA);
            }
            return Ok(result);
        }

    }
}
