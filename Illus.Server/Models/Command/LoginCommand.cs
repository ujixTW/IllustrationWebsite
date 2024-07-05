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
    public class EditPasswordCommand
    {
        public string OldPWD { get; set; } = string.Empty;
        public string NewPWD { get; set; } = string.Empty;
        public string NewPWDAgain { get; set; } = string.Empty;
    }
    public class EditPWDFromEmailCommand
    {
        public Guid Token { get; set; }
        public Guid CAPTCHA { get; set; }
        public EditPasswordCommand PasswordCommand { get; set; } = new EditPasswordCommand();
    }
    public class EditUserDataCommand
    {
        public int Id { get; set; }
        public string NickName { get; set; } = string.Empty;
        public string Profile { get; set; } = string.Empty;
        public IFormFile? cover { get; set; }
        public IFormFile? headshot { get; set; }
        public int LanguageiD { get; set; }
        public int CountryiD { get; set; } 
    }
}
