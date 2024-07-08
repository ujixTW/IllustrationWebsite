using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Sservices.Works;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor.TagHelpers;

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
        [HttpGet("GetList")]
        public IActionResult GetWorkList(
            [FromQuery] int page, [FromQuery] string? keywords, [FromQuery] bool isDesc,
            [FromQuery] int orderType, [FromQuery] bool isR18, [FromQuery] bool isAI,
            [FromQuery] int workCount)
        {
            if (page <= 0) page = 0;
            if (string.IsNullOrEmpty(keywords)) keywords = string.Empty;

            var list = _workServices.GetWorkList(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
                IsR18 = isR18,
                IsAI = isAI,
                Keywords = keywords,
                OrderType = orderType
            });

            return Ok(list);
        }
        [HttpGet("GetList/Daily")]
        public IActionResult GetDailyWorkList(
            [FromQuery] bool isR18, [FromQuery] bool isAI, [FromQuery] int workCount)
        {
            var list = _workServices.GetDailyWorkList(isR18, isAI, workCount);
            return Ok(list);
        }
        [HttpGet("GetList/Artist/{id}")]
        public IActionResult GetArtistWorkList(
            int id, [FromQuery] int page, [FromQuery] int count,
            [FromQuery] bool isDesc, [FromQuery] int orderType)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var isOwnWorks = (int.TryParse(userIdStr, out int userId) && userId == id) ? true : false;
            var command = new WorkListCommand
            {
                Page = page,
                Count = count,
                IsDesc = isDesc,
                OrderType = orderType
            };

            var list = _workServices.GetArtistWorkList(command, id, isOwnWorks);
            return Ok(list);
        }
        [HttpGet("{workId}")]
        public IActionResult GetWorkDetail(int workId)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var model = new ArtworkViewModel();
            var success = false;
            if (int.TryParse(userIdStr, out int userId))
            {
                model = _workServices.GetWorkDetail(workId, userId, out success);
            }
            else
            {
                model = _workServices.GetWorkDetail(workId, null, out success);
            }

            return (success) ? Ok(model) : NotFound();
        }
        //新增作品
        [HttpPost("Add")]
        public async Task<IActionResult> AddWork(EditWorkCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;

            var tempImgs = command.Imgs;
            tempImgs.Add(command.Cover);

            if (int.TryParse(userIdStr, out int userId) && FileHelper.IsImage(tempImgs))
            {
                success = await _workServices.AddWork(command, userId);
            }
            return (success) ? Ok() : BadRequest();
        }
        //刪除作品
        [HttpPost("Delete")]
        public IActionResult DeleteWork(int workId, int workArtistId)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            if (int.TryParse(userIdStr, out int userId) && userId == workArtistId)
            {
                success = _workServices.DeleteWork(workId, workArtistId);
            }
            return (success) ? Ok() : BadRequest();
        }
        //編輯作品
        //不會對標籤進行編輯
        [HttpPost("Edit")]
        public async Task<IActionResult> EditWork(EditWorkCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;

            var tempImgs = command.Imgs;
            tempImgs.Add(command.Cover);

            if (int.TryParse(userIdStr, out int userId) && FileHelper.IsImage(tempImgs))
            {
                success = await _workServices.EditWork(command, userId);
            }
            return (success) ? Ok() : BadRequest();
        }
        [HttpGet("Tag/GetUserHistory")]
        public IActionResult GetUserHistoryTag()
        {
            var tagList = new List<TagModel>();
            var userIdStr = Request.Cookies[_userIdKey];

            if (int.TryParse(userIdStr, out int userId))
            {
                tagList = _workServices.GetUserHistoryTag(userId);
            }
            return Ok(tagList);
        }
        [HttpGet("Tag/GetRecommand")]
        public IActionResult GetTagRecommand(string input)
        {
            var tagList = new List<TagModel>();
            if (!string.IsNullOrEmpty(input))
            {
                tagList = _workServices.GetTagRecommand(input);
            }
            return Ok(tagList);
        }
        [HttpPost("Tag/Edit")]
        public IActionResult EditTag(EditTagCommand command, int workId)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            if (int.TryParse(userIdStr, out int userId))
            {
                _workServices.EditTag(command, workId, userId);
            }
            return Ok();
        }

    }
}
