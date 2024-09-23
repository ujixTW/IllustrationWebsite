using Illus.Server.Models.Command;
using Illus.Server.Sservices.Works;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Illus.Server.Controllers.Works
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _messageService;
        private readonly string _userIdKey;
        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
            _userIdKey = "UserId";
        }
        [HttpPost("Write")]
        public IActionResult WriteCommand(MessageCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            if (int.TryParse(userIdStr, out int userId) &&
                !string.IsNullOrWhiteSpace(command.Message))
            {
                success = _messageService.WriteCommand(command, userId);
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("Edit")]
        public IActionResult EditCommand(MessageCommand command)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            if (int.TryParse(userIdStr, out var userId) &&
                !string.IsNullOrWhiteSpace(command.Message))
            {
                success = _messageService.EditCommand(command, userId);
            }
            return success ? Ok() : BadRequest();
        }
        [HttpPost("Delete/{id}")]
        public IActionResult DeleteCommand(int id)
        {
            var userIdStr = Request.Cookies[_userIdKey];
            var success = false;
            if (int.TryParse(userIdStr, out int userId))
            {
                success = _messageService.DeleteCommand(id, userId);
            }
            return success ? Ok() : BadRequest();
        }
        [HttpGet("{workId}")]
        public async Task<IActionResult> GetCommandList(int workId, [FromQuery] int pageCount, [FromQuery] int? lastId)
        {
            var messageList = await _messageService.GetCommandList(workId, pageCount, lastId);
            return Ok(messageList);
        }
    }
}
