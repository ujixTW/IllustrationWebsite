using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Services.Admin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Illus.Server.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminLoginController : ControllerBase
    {
        private readonly AdminLoginService _service;
        private readonly string _adminIdKey;
        private readonly string _adminLoginDataKey;
        private readonly int _loginTimeOutMin;
        public AdminLoginController(AdminLoginService service)
        {
            _service = service;
            _adminIdKey = "AdminId";
            _adminLoginDataKey = "AdminLoginDataKey";
            _loginTimeOutMin = 20;
        }
        [HttpPost("/api/Admin/Login")]
        public IActionResult Login(LoginCommand command)
        {
            AdminModel? result = null;

            if (!string.IsNullOrWhiteSpace(command.Account) &&
                !string.IsNullOrWhiteSpace(command.Password))
            {
                command.Account = command.Account.Trim();
                command.Password = command.Password.Trim();

                result = _service.Login(command);
            }

            if (result != null)
            {
                var option = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTime.Now.AddMinutes(_loginTimeOutMin)
                };
                HttpContext.Response.Cookies.Append(_adminIdKey, result.Id.ToString(), option);
                var adminJson = JsonSerializer.Serialize(command);
                HttpContext.Response.Cookies.Append(_adminLoginDataKey, adminJson, option);
            }

            return result != null ? Ok(result) : BadRequest();
        }
        [HttpGet("/api/Admin/LogOut")]
        public IActionResult Logout()
        {
            if (Request.Cookies[_adminLoginDataKey] != null)
            {
                Response.Cookies.Delete(_adminIdKey);
                Response.Cookies.Delete(_adminLoginDataKey);
            }
            return Ok();
        }
        [HttpGet("/api/Admin/LoginCheck")]
        public IActionResult LoginCheck()
        {
            AdminModel? result = null;
            var loginDataJSON = Request.Cookies[_adminLoginDataKey];
            var loginData = (loginDataJSON != null) ?
                JsonSerializer.Deserialize<LoginCommand>(loginDataJSON) : null;

            if (loginData != null)
            {
                result = _service.Login(loginData);
            }

            return result != null ? Ok(result) : BadRequest();
        }
    }
}
