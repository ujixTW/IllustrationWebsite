namespace Illus.Server.Models.Command
{
    public class LoginCommand
    {
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
    public enum SignUpError
    {
        None = 0,
        Format = 1,
        Duplicate = 2,
    }
    public class SignUpResult
    {
        public int AccError { get; set; }
        public int PwdError { get; set; }
        public int EmailError { get; set; }
    }
    public class EditPasswordCommand
    {
        public string OldPWD { get; set; } = string.Empty;
        public string NewPWD { get; set; } = string.Empty;
        public string NewPWDAgain { get; set; } = string.Empty;
    }
    public class EditPWDFromEmailCommand
    {
        public Guid CAPTCHA { get; set; }
        public string Email { get; set; }
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
