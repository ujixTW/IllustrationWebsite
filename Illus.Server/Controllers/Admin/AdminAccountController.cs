using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Sservices.Admin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;

namespace Illus.Server.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminAccountController : ControllerBase
    {
        private readonly AdminAccountService _service;
        private readonly string _adminIdKey;
        public AdminAccountController(AdminAccountService service)
        {
            _service = service;
            _adminIdKey = "AdminId";
        }
        [HttpPost("/api/Admin/Create")]
        public IActionResult CreateAdmin(AdminCommand command)
        {
            var editorIdStr = Request.Cookies[_adminIdKey];
            var success = false;
            if (int.TryParse(editorIdStr, out var editorId) &&
                !StringHelper.HasHtml(command.Account))
            {
                success = _service.CreateAdmin(new AdminCommand
                {
                    EditorId = editorId,
                    Account = command.Account.Trim(),
                    Password = command.Password.Trim(),
                });
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("/api/Admin/Edit")]
        public IActionResult EditAdmin(AdminCommand command)
        {
            var editorIdStr = Request.Cookies[_adminIdKey];
            var success = false;
            if (int.TryParse(editorIdStr, out var editorId) &&
                !string.IsNullOrWhiteSpace(command.NewPwd) &&
                command.Password.Trim() != command.NewPwd.Trim() &&
                command.NewPwd.Trim() == command.NewPwdAgain.Trim() &&
                !StringHelper.HasHtml(command.Account))
            {
                success = _service.EditAdmin(new AdminCommand
                {
                    Id = editorId,
                    EditorId = editorId,
                    Account = command.Account.Trim(),
                    Password = command.Password.Trim(),
                    NewPwd = command.NewPwd.Trim(),
                });
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("/api/Admin/Edit/{id}")]
        public IActionResult EditAdmin(int id, AdminCommand command)
        {
            var editorIdStr = Request.Cookies[_adminIdKey];
            var success = false;
            if (int.TryParse(editorIdStr, out var editorId) &&
                id != editorId &&
                StringHelper.HasHtml(command.Account) &&
                _service.CheckAdminRelationship(editorId, id))
            {
                success = _service.EditOtherAdmin(new AdminCommand
                {
                    Id = id,
                    EditorId = editorId,
                    Account = command.Account.Trim(),
                    NewPwd = command.NewPwd.Trim(),
                    Access = command.Access
                });
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("/api/Admin/Delete/{id}")]
        public IActionResult DeleteAdmin(int id)
        {
            var editorIdStr = Request.Cookies[_adminIdKey];
            var success = false;
            if (int.TryParse(editorIdStr, out var editorId) &&
                id != editorId &&
                _service.CheckAdminRelationship(editorId, id))
            {
                success = _service.DeleteAdmin(id);
            }
            return success ? Ok() : BadRequest();
        }
    }
}
