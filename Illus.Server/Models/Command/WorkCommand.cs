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
}