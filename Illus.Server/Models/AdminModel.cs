namespace Illus.Server.Models
{
    public class AdminModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int Access { get; set; }
        public bool IsEnable { get; set; }
    }
}
