using Illus.Server.Helper;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Sservices.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LoginService _loginService;
        private readonly string _loginTokenKey;
        private readonly string _userIdKey;
        public LoginController(LoginService loginService)
        {
            _loginService = loginService;
            _loginTokenKey = "LoginToken";
            _userIdKey = "UserId";
        }
        [HttpPost]
        public IActionResult Login(LoginCommand command)
        {
            var result = false;

            if ((StringHelper.IsValidAccount(command.Account) ||
                StringHelper.IsValidEmail(command.Email)) &&
                StringHelper.IsValidPassword(command.Password)
              )
            {
                var token = _loginService.Login(command);
                if (token != null)
                {
                    var option = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Lax,
                        Expires = DateTime.Now.AddYears(50)
                    };
                    HttpContext.Response.Cookies.Append(_loginTokenKey, token.LoginToken.ToString(), option);
                    HttpContext.Response.Cookies.Append(_userIdKey, token.UserId.ToString(), option);
                    result = true;
                }
            }
            return Ok(result);
        }
        [HttpGet("/api/LoginCheck")]
        public async Task<IActionResult> LoginCheck()
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];

            LoginCheckModel model = new LoginCheckModel();

            if (int.TryParse(userIdStr, out var userId) &&
                Guid.TryParse(tokenStr, out var token))
            {
                model = await _loginService.LoginCheck(new Models.LoginTokenModel()
                {
                    UserId = userId,
                    LoginToken = token,
                });
            }
            return Ok(model);
        }
        [HttpGet("/api/Logout")]
        public IActionResult Logout()
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];
            var result = false;
            if (int.TryParse(userIdStr, out int userId) && Guid.TryParse(tokenStr, out Guid token))
            {
                result = _loginService.Logout(userId, token);
                if (result)
                {
                    Response.Cookies.Delete(_userIdKey);
                    Response.Cookies.Delete(_loginTokenKey);
                }
            }
            return (result) ? Ok() : BadRequest();
        }
    }
}
