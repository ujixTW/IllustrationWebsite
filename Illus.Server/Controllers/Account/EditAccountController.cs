using Illus.Server.Models.Command;
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
        [HttpPost]
        public IActionResult EditAccount(string accountCommand)
        {
            var result = false;
            var userIdStr = Request.Cookies[_userIdKey];

            if (int.TryParse(userIdStr, out int userId) &&
                !string.IsNullOrEmpty(accountCommand) &&
                accountCommand.Length >= 6 &&
                accountCommand.Length <= 16)
            {
                result = _editService.EditAccount(accountCommand, userId);
            }
            return Ok(result);
        }
        //變更信箱
        [HttpPost("/api/EditEmail")]
        public IActionResult EditEmail(string emailCommand)
        {
            var result = false;
            var userIdStr = Request.Cookies[_userIdKey];

            if (int.TryParse(userIdStr, out int userId) &&
                !string.IsNullOrEmpty(emailCommand) &&
                emailCommand.Contains("@"))
            {
                result = _editService.EditEmail(emailCommand, userId);
            }
            return Ok(result);
        }
        //信箱認證
        [HttpGet("/api/EditEmail/{CAPTCHA}")]
        public IActionResult EditEmailComfirm(Guid CAPTCHA)
        {
            var result = false;
            result = _editService.EditEmailComfirm(CAPTCHA);
            return (result) ? Ok() : BadRequest();
        }
        //變更密碼(登入狀態)
        [HttpPost("/api/EditPassword")]
        public IActionResult EditPassword(EditPasswordCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var result = false;
            if (int.TryParse(userIdStr, out int userId) &&
                !string.IsNullOrEmpty(command.OldPWD) &&
                !string.IsNullOrEmpty(command.NewPWD) &&
                command.NewPWD.Length >= 6 &&
                command.NewPWD.Length <= 32 &&
                !string.Equals(command.OldPWD, command.NewPWD) &&
                string.Equals(command.NewPWD, command.NewPWDAgain))
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
        [HttpGet("/api/forgetPassword/{Email}")]
        public IActionResult ForgetPassword(string Email)
        {
            var result = false;
            if (!string.IsNullOrEmpty(Email) && Email.Contains("@"))
            {
                result = _editService.ForgetPassword(Email);
            }
            return (result) ? Ok() : BadRequest();
        }
        //變更密碼(信箱連結)
        [HttpPost("/api/forgetPassword")]
        public IActionResult EditPWDFormEmail(EditPWDFromEmailCommand command)
        {
            var result = false;
            var pwds = command.PasswordCommand;

            if (!string.IsNullOrEmpty(pwds.OldPWD) &&
                !string.IsNullOrEmpty(pwds.NewPWD) &&
                pwds.NewPWD.Length >= 6 &&
                pwds.NewPWD.Length <= 32 &&
                !string.Equals(pwds.OldPWD, pwds.NewPWD) &&
                string.Equals(pwds.NewPWD, pwds.NewPWDAgain))
            {

                result = _editService.EditPWDFormEmail(command);
            }

            return (result) ? Ok() : BadRequest();
        }
    }
}
