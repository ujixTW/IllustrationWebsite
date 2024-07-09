namespace Illus.Server.Models.Command
{
    public class MessageCommand
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
