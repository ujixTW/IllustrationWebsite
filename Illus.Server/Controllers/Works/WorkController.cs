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
        public WorkController(WorkService workServices)
        {
            _workServices = workServices;
            _userIdKey = "UserId";
        }

        #region 取得作品資訊 
        //取得作品列表，以QueryString判定搜尋條件
        [HttpGet("GetList")]
        public async Task<IActionResult> GetWorkList(
            [FromQuery] int page, [FromQuery] string? keywords, [FromQuery] bool isDesc,
            [FromQuery] int orderType, [FromQuery] bool isR18, [FromQuery] bool isAI,
            [FromQuery] int workCount)
        {
            if (string.IsNullOrEmpty(keywords)) keywords = string.Empty;

            var list = await _workServices.GetWorkList(SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
                IsR18 = isR18,
                IsAI = isAI,
                Keywords = keywords,
                OrderType = orderType
            }));

            return Ok(list);
        }

        [HttpGet("GetList/Daily")]
        public async Task<IActionResult> GetDailyWorkList(
            [FromQuery] int page, [FromQuery] bool isR18, [FromQuery] bool isAI,
            [FromQuery] int workCount)
        {
            var list = new ArtworkViewListModel();
            var commend = SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsAI = isAI,
                IsR18 = isR18
            });

            if (commend.UserId >= 0)
            {
                list = await _workServices.GetDailyWorkList(commend);
            }
            return Ok(list);
        }
        [HttpGet("GetList/Artist/{id}")]
        public async Task<IActionResult> GetArtistWorkList(
            int id, [FromQuery] int page, [FromQuery] bool isDesc, [FromQuery] int orderType,
            [FromQuery] bool isR18, [FromQuery] int workCount)
        {

            var commend = SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
                OrderType = orderType,
                IsR18 = isR18
            });
            var idList = new List<int> { id };
            var isOwn = commend.UserId == id;

            var list = await _workServices.GetArtistWorkList(commend, idList, isOwn);
            return Ok(list);
        }
        [HttpGet("GetList/Following")]
        public async Task<IActionResult> GetFollowingWorkList(
            [FromQuery] int page, [FromQuery] bool isR18, [FromQuery] int workCount)
        {
            var result = new ArtworkViewListModel();
            var commend = SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                IsR18 = isR18,
                Count = workCount
            });
            if (commend.UserId >= 0)
            {
                result = await _workServices.GetFollowingWorkList(commend);
            }
            return Ok(result);
        }
        [HttpGet("GetList/Background")]
        public async Task<IActionResult> GetBackgroundWorkList()
        {
            var result = await _workServices.GetBackgroundWorkList();

            return Ok(result);
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
        public IActionResult GetArtworkHistoryList([FromQuery] int page, [FromQuery] bool isDesc, [FromQuery] int workCount)
        {
            var result = new ArtworkViewListModel();
            var commend = SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                Count = workCount,
                IsDesc = isDesc,
            });
            if (commend.UserId >= 0)
            {
                result = _workServices.GetArtworkHistoryList(commend);
            }
            return Ok(result);
        }
        [HttpGet("GetList/Like")]
        public IActionResult GetLikeArtWorkList([FromQuery] int page, [FromQuery] int workCount)
        {
            var result = new ArtworkViewListModel();
            var commend = SetWorkListCommand(new WorkListCommand
            {
                Page = page,
                Count = workCount
            });
            if (commend.UserId >= 0)
            {
                result = _workServices.GetLikeArtWorkList(commend);
            }
            return Ok(result);
        }
        #endregion
        #region 編輯作品 
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
        #endregion
        #region 標籤讀取與編輯 
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
        public async Task<IActionResult> EditTag(EditTagCommand command, int workId)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var result = new List<TagModel>();
            if (int.TryParse(userIdStr, out int userId))
            {
                result = await _workServices.EditTag(command, workId, userId);
            }
            return Ok(result);
        }
        #endregion
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
                recommandList = await _workServices.GetSearchRecommand(st);
            }
            return Ok(recommandList);
        }
        [NonAction]
        private WorkListCommand SetWorkListCommand(WorkListCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var orderTypeArr = Enum.GetValues(typeof(WorkListOrder));

            return new WorkListCommand
            {
                UserId = (int.TryParse(userIdStr, out int userId)) ? userId : -1,
                Page = (command.Page < 0) ? 0 : command.Page,
                Count = (command.Count <= 100) ? command.Count : 0,
                IsR18 = command.IsR18,
                IsAI = command.IsAI,
                Keywords = command.Keywords.Trim(),
                IsDesc = command.IsDesc,
                OrderType = (command.OrderType >= orderTypeArr.Length || command.OrderType < 0) ?
                    (int)WorkListOrder.Hot : command.OrderType,
            };
        }
    }
}
