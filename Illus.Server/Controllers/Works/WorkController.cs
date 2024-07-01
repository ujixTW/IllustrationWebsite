using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Sservices.Works;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Illus.Server.Controllers.Works
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkController : ControllerBase
    {
        private readonly WorkService _workServices;
        private readonly string _userIdKey;
        public WorkController(WorkService workServices)
        {
            _workServices = workServices;
            _userIdKey = "UserId";
        }
        //取得作品列表，以QueryString判定搜尋條件
        [HttpGet("GetWorkList")]
        public IActionResult GetWorkList(
            [FromQuery] int page, [FromQuery] string? keywords, [FromQuery] bool isDesc,
            [FromQuery] int orderType, [FromQuery] bool isR18, [FromQuery] bool isAI,
            [FromQuery] int workCount)
        {
            if (page <= 0) page = 0;
            if (string.IsNullOrEmpty(keywords)) keywords = string.Empty;

            var model = new List<ArtworkViewModel>();
            model = _workServices.GetWorkList(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
                IsR18 = isR18,
                IsAI = isAI,
                Keywords = keywords,
                OrderType = orderType
            });

            return Ok(model);
        }
        [HttpGet("GetWorkList/Daily")]
        public IActionResult GetDailyWorkList(
            [FromQuery] bool isR18, [FromQuery] bool isAI, [FromQuery] int workCount)
        {
            var list = _workServices.GetDailyWorkList(isR18, isAI, workCount);
            return Ok(list);
        }
        [HttpGet("{workId}")]
        public IActionResult GetWorkDetail(int workId)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var model = new ArtworkViewModel();

            if (int.TryParse(userIdStr, out int userId))
            {
                model = _workServices.GetWorkDetail(workId, userId);
            }
            else
            {
                model = _workServices.GetWorkDetail(workId, null);
            }

            return (model != null) ? Ok(model) : BadRequest();
        }
        //新增作品
        //編輯作品
    }
}
