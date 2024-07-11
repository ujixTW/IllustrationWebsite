using Illus.Server.Models.View;
using Illus.Server.Sservices.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FollowService _followService;
        private readonly string _userIdKey;
        public UserController(FollowService followService)
        {
            _followService = followService;
            _userIdKey = "UserId";
        }
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            int.TryParse(userIdStr, out int userId);

            var userData = _followService.GetUser(id, userId);

            return (userData != null) ? Ok(userData) : BadRequest();
        }
        [HttpPost("Follow/{id}")]
        public IActionResult Follow(int id)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            if (int.TryParse(userIdStr, out int userId) && userId != id)
            {
                success = _followService.Follow(id, userId);
            }
            return success ? Ok() : BadRequest();
        }
        [HttpGet("GetFollowingList/{id}")]
        public async Task<IActionResult> GetFollowingList(int id, [FromQuery] int p)
        {

            var userList = await _followService.GetFollowingList(id, p);

            return Ok(userList);
        }
        [HttpGet("GetFollowerList")]
        public IActionResult GetFollowerList([FromQuery] int p)
        {
            var userList = new FollowViewListModel();
            var userIdStr = Request.Cookies[_userIdKey];
            if (int.TryParse(userIdStr, out int userId))
            {
                userList = _followService.GetFollowerList(userId, p);
            }
            return Ok(userList);
        }
    }
}
