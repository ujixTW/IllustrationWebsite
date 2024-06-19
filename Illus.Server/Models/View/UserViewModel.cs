namespace Illus.Server.Models.View
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string NickName { get; set; } = string.Empty;
        public string? Profile { get; set; }
        public string? Language { get; set; }
        public string? Country { get; set; }
        public string? CoverContent { get; set; }
        public string? HeadshotContent { get; set; }
    }
}
