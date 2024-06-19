namespace Illus.Server.Models.Command
{
    public class LoginCommand
    {
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }   
    public class SignUpResult
    {
        public bool Success { get; set; }
        public string Error { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public Guid? Token { get; set; }
    }
}
