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
        public IActionResult EditAccount()
        {
            return Ok();
        }
        //變更信箱
        [HttpPost]
        public IActionResult EditEmail()
        {
            return Ok();
        }
        //變更密碼(登入狀態)
        [HttpPost]
        public IActionResult EditPassword()
        {
            return Ok();
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
            return Ok(result);
        }
        //變更密碼(信箱連結)
        [HttpPost]
        public IActionResult EditPWDFormEmail(EditPWDFormEmailCommand command)
        {
            var result = false;
            var pwds = command.PasswordCommand;

            if (!string.IsNullOrEmpty(pwds.OldPWD) ||
                !string.IsNullOrEmpty(pwds.NewPWD) ||
                !string.IsNullOrEmpty(pwds.NewPWDAgain) ||
                string.Equals(pwds.NewPWD, pwds.NewPWDAgain))
            {
               
                result = _editService.EditPWDFormEmail(command);
            }

            return Ok(result);
        }
    }
}
