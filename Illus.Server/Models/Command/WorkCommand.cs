namespace Illus.Server.Models.Command
{
    public class WorkCommand
    {
    }
    public class WorkListCommand
    {
        public int Page { get; set; }
        public int Count { get; set; }
        public int LastId {  get; set; }
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public string Keywords { get; set; } = string.Empty;
        public string OrderType { get; set; } = string.Empty;
    }
}