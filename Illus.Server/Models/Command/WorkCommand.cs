namespace Illus.Server.Models.Command
{
    public class WorkListCommand
    {
        public int Page { get; set; }
        public int Count { get; set; }
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public string Keywords { get; set; } = string.Empty;
        public bool IsDesc { get; set; }
        public int OrderType { get; set; }
    }
    public enum WorkListOrder : int
    {
        PostTime = 0,
        Hot = 1
    }
    public class EditWorkCommand
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public DateTime PostTime { get; set; }
        public bool IsOpen { get; set; }
        public List<IFormFile> Imgs { get; set; } = new List<IFormFile>();
        public required IFormFile Cover { get; set; }
        public List<EditTagCommand> Tags { get; set; } = new List<EditTagCommand>();
    }
    public class EditTagCommand
    {
        public int? Id { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}