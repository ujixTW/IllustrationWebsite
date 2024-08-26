using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Sservices.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class EditAccountController : ControllerBase
    {
        private readonly EditAccountService _editService;
        private readonly string _loginTokenKey;
        private readonly string _userIdKey;
        public EditAccountController(EditAccountService editService)
        {
            _editService = editService;
            _loginTokenKey = "LoginToken";
            _userIdKey = "UserId";
        }
        //變更帳號
        [HttpPost("Account")]
        public IActionResult EditAccount(string accountCommend)
        {
            var result = false;
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];

            if (int.TryParse(userIdStr, out int userId) &&
                Guid.TryParse(tokenStr, out Guid token) &&
                StringHelper.IsValidAccount(accountCommend) &&
                _editService.CheckUserIdentity(token, userId))
            {
                result = _editService.EditAccount(accountCommend, userId);
            }
            return Ok(result);
        }
        //變更信箱
        [HttpPost("Email")]
        public IActionResult EditEmail(string emailCommand)
        {
            var result = false;
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];

            if (int.TryParse(userIdStr, out int userId) &&
                Guid.TryParse(tokenStr, out Guid token) &&
                StringHelper.IsValidEmail(emailCommand) &&
                _editService.CheckUserIdentity(token, userId))
            {
                result = _editService.EditEmail(emailCommand, userId);
            }
            return Ok(result);
        }
        //信箱認證
        [HttpGet("EmailConfirm/{email}")]
        public IActionResult EmailComfirm(string email, [FromQuery] Guid CAPTCHA)
        {
            var result = false;
            if (StringHelper.IsValidEmail(email))
                result = _editService.EmailComfirm(email, CAPTCHA);
            return (result) ? Ok() : BadRequest();
        }
        //變更密碼(登入狀態)
        [HttpPost("Password")]
        public IActionResult EditPassword(EditPasswordCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var tokenStr = Request.Cookies[_loginTokenKey];

            var result = false;
            if (int.TryParse(userIdStr, out int userId) &&
                Guid.TryParse(tokenStr, out Guid token) &&
                StringHelper.IsValidPassword(command.OldPWD) &&
                StringHelper.IsValidPassword(command.NewPWD) &&
                !string.Equals(command.OldPWD, command.NewPWD) &&
                string.Equals(command.NewPWD, command.NewPWDAgain) &&
                _editService.CheckUserIdentity(token, userId))
            {
                result = _editService.EditPassword(command, userId);
            }
            return (result) ? Ok() : BadRequest();
        }
        /// <summary>
        /// 寄送忘記密碼信件
        /// </summary>
        /// <param name="Email"></param>
        /// <returns></returns>
        [HttpGet("ForgetPassword/{email}")]
        public IActionResult ForgetPassword(string email)
        {
            var result = false;
            if (StringHelper.IsValidEmail(email))
            {
                result = _editService.ForgetPassword(email);
            }
            return Ok(result);
        }
        //變更密碼(信箱連結)
        [HttpPost("ForgetPassword")]
        public IActionResult EditPWDFormEmail(EditPWDFromEmailCommand command)
        {
            var result = false;
            var pwds = command.PasswordCommand;

            if (StringHelper.IsValidEmail(command.Email) &&
                StringHelper.IsValidPassword(pwds.NewPWD) &&
                string.Equals(pwds.NewPWD, pwds.NewPWDAgain))
            {

                result = _editService.EditPWDFormEmail(command);
            }

            return result ? Ok() : BadRequest();
        }
        [HttpPost("UserData")]
        public async Task<IActionResult> EditUserData(EditUserDataCommand command)
        {
            var result = false;
            var tokenStr = Request.Cookies[_loginTokenKey];
            var userIdStr = Request.Cookies[_userIdKey];
            if (int.TryParse(userIdStr, out int userId) &&
                Guid.TryParse(tokenStr, out Guid token) &&
                userId == command.Id &&
                _editService.CheckUserIdentity(token, command.Id))
            {
                result = await _editService.EditUserData(command);
            }
            return (result) ? Ok() : BadRequest();
        }
    }
}
