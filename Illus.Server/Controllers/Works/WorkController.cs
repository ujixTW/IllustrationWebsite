using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Illus.Server.Sservices.Works;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Works
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkController : ControllerBase
    {
        private readonly WorkService _workServices;
        private readonly string _userIdKey;
        private readonly int _onePageWorkCount;
        public WorkController(WorkService workServices)
        {
            _workServices = workServices;
            _userIdKey = "UserId";
            _onePageWorkCount = 24;
        }
        //取得作品列表，以QueryString判定搜尋條件
        [HttpGet("GetList")]
        public async Task<IActionResult> GetWorkList(
            [FromQuery] int page, [FromQuery] string? keywords, [FromQuery] bool isDesc,
            [FromQuery] int orderType, [FromQuery] bool isR18, [FromQuery] bool isAI,
            [FromQuery] int workCount)
        {
            if (page <= 0) page = 0;
            if (string.IsNullOrWhiteSpace(keywords)) keywords = string.Empty;

            var userIdStr = Request.Cookies[_userIdKey];

            var list = await _workServices.GetWorkList(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
                IsR18 = isR18,
                IsAI = isAI,
                Keywords = keywords,
                OrderType = orderType
            }, int.TryParse(userIdStr, out int userId) ? userId : null);

            return Ok(list);
        }
        [HttpGet("GetList/Daily")]
        public async Task<IActionResult> GetDailyWorkList(
            [FromQuery] bool isR18, [FromQuery] bool isAI, [FromQuery] int workCount)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var list = await _workServices.GetDailyWorkList(
                isR18, isAI, workCount,
                int.TryParse(userIdStr, out int userId) ? userId : null);

            return Ok(list);
        }
        [HttpGet("GetList/Artist/{id}")]
        public IActionResult GetArtistWorkList(
            int id, [FromQuery] int page, [FromQuery] bool isDesc, [FromQuery] int orderType)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var isOwnWorks = (int.TryParse(userIdStr, out int userId) && userId == id) ? true : false;
            var command = new WorkListCommand
            {
                Page = page,
                Count = _onePageWorkCount,
                IsDesc = isDesc,
                OrderType = orderType
            };

            var list = _workServices.GetArtistWorkList(command, id, isOwnWorks, userId);
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
        [HttpGet("GetList/History")]
        public IActionResult GetArtworkHistoryList([FromQuery] int page, [FromQuery] bool isDesc)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var result = new ArtworkViewListModel();
            var success = false;
            if (int.TryParse(userIdStr, out int userId))
            {
                result = _workServices.GetArtworkHistoryList(new WorkListCommand
                {
                    Page = page,
                    Count = _onePageWorkCount,
                    IsDesc = isDesc
                }, userId);
                success = true;
            }
            return success ? Ok(result) : BadRequest();
        }
        [HttpGet("GetList/Like")]
        public IActionResult GetLikeArtWorkList([FromQuery] int page)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var result = new ArtworkViewListModel();
            var success = false;
            if (int.TryParse(userIdStr, out int userId))
            {
                result = _workServices.GetLikeArtWorkList(new WorkListCommand
                {
                    Page = page,
                    Count = _onePageWorkCount,
                }, userId);
                success = true;
            }
            return success ? Ok(result) : BadRequest();
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
            if (!string.IsNullOrWhiteSpace(input))
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
        [HttpPost("Like")]
        public IActionResult LikeWork(int wid)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            var likes = 0;
            if (int.TryParse(userIdStr, out int userId))
            {
                success = _workServices.LikeWork(wid, userId, out likes);
            }

            return success ? Ok(likes) : BadRequest();
        }
        [HttpGet("Like/{workId}")]
        public async Task<IActionResult> GetLikeList(int workId)
        {
            var userList = await _workServices.GetLikeList(workId);
            return Ok(userList);
        }
        [HttpGet("GetSearchRecommand")]
        public async Task<IActionResult> GetSearchRecommand([FromQuery] string st)
        {
            var recommandList = new List<TagModel>();
            if (!string.IsNullOrWhiteSpace(st))
            {
                recommandList=await _workServices.GetSearchRecommand(st);
            }
            return Ok(recommandList);
        }
    }
}
