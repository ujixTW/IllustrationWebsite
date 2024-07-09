namespace Illus.Server.Models.View
{
    public class MessageViewModel
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int UserId { get; set; }
        public string UserNickName { get; set; } = string.Empty;
        public string UserHeadshot { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreateTime { get; set; }
        public bool IsEdit { get; set; }
    }
}
