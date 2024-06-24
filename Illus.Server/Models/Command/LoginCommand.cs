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
    public class PasswordCommand
    {
        public string OldPWD { get; set; } = string.Empty;
        public string NewPWD { get; set; } = string.Empty;
        public string NewPWDAgain { get; set; } = string.Empty;
    }
    public class EditPWDFormEmailCommand
    {
        public Guid Token { get; set; }
        public Guid CAPTCHA { get; set; }
        public PasswordCommand PasswordCommand { get; set; } = new PasswordCommand();
    }
}
