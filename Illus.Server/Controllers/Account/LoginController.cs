﻿using Illus.Server.Models.Command;
using Illus.Server.Models.View;
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
                    HttpContext.Response.Cookies.Append(_loginTokenKey, token.LoginToken.ToString(), new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                    HttpContext.Response.Cookies.Append(_userIdKey, token.UserId.ToString(), new CookieOptions() { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Lax });
                    result.Success = true;
                }
                else
                {
                    result.Success = false;
                    result.Error = "NO USER";
                }
            }
            return Ok(result);
        }
        [HttpGet]
        public IActionResult LoginCheck()
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];

            UserViewModel? model = null;

            if (int.TryParse(userIdStr, out var userId) &&
                Guid.TryParse(tokenStr, out var token) )
            {
                model = _loginService.LoginCheck(new Models.LoginTokenModel()
                {
                    UserId = userId,
                    LoginToken = token,
                });
            }
            return Ok(model);
        }
    }
}
