using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Services.Admin;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminWorkController : ControllerBase
    {
        private readonly AdminWorkService _service;
        private readonly string _adminIdKey;
        public AdminWorkController(AdminWorkService service)
        {
            _adminIdKey = "AdminId";
            _service = service;
        }
        [HttpGet("/api/Admin/DailyThem/List")]
        public async Task<IActionResult> GetDailyThemList([FromQuery] int p, [FromQuery] bool isDesc, [FromQuery] DateTime? st, [FromQuery] DateTime? et, [FromQuery] int? tid, [FromQuery] int? aid)
        {
            var result = new DailyThemListModel();
            var adminIdStr = Request.Cookies[_adminIdKey];
            if (int.TryParse(adminIdStr, out var adminId))
            {
                result = await _service.GetDailyThemList(new DailyTagListCommand
                {
                    Page = p,
                    IsDesc = isDesc,
                    StartTime = st,
                    EndTime = et,
                    TagId = tid,
                    AdminId = aid
                });
            }
            return Ok(result);
        }
        [HttpGet("/api/Admin/DailyThem/{id}")]
        public IActionResult GetDailyThem(int id)
        {
            var result = new DailyThemeModel();
            var adminIdStr = Request.Cookies[_adminIdKey];
            if (int.TryParse(adminIdStr, out var adminId))
            {
                result = _service.GetDailyThem(id);
            }
            return Ok(result);
        }
        [HttpPost("/api/Admin/DailyThem/Add")]
        public async Task<IActionResult> AddDailyThem(DailyThemeModel command)
        {
            var success = false;
            var adminIdStr = Request.Cookies[_adminIdKey];

            if (int.TryParse(adminIdStr, out var adminId) &&
                command.SpecifyDay > DateTime.Today.AddDays(1))
            {
                command.AdminId = adminId;
                success = await _service.AddDailyThem(command);
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("/api/Admin/DailyThem/Edit")]
        public async Task<IActionResult> EditDailyThem(DailyThemeModel command)
        {
            var success = false;
            var adminIdStr = Request.Cookies[_adminIdKey];
            if (int.TryParse(adminIdStr, out var adminId) &&
                command.SpecifyDay > DateTime.Today.AddDays(1))
            {
                command.AdminId = adminId;
                success = await _service.EditDailyThem(command);
            }
            return success ? Ok() : BadRequest();
        }

    }
}
