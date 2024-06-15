namespace Illus.Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string? Profile { get; set; }
        public int? LanguageId { get; set; }
        public int? CountryID { get; set; }
        public string? CoverContent { get; set; }
        public string? HeadshotContent { get; set; }
        public DateTime CreateTime { get; set; }
        public bool EmailConfirmed { get; set; } = false;
        public bool IsActivation { get; set; } = false;
        public virtual LanguageModel? Language { get; set; }
        public virtual CountryModel? Country { get; set; }
        public virtual LoginTokenModel? LoginToken { get; set; }
        public virtual GotchaModel? Gotcha { get; set; }
    }
    public class LoginTokenModel
    {
        public int Id { get; set; }
        public Guid LoginToken { get; set; }
        public int UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        public virtual UserModel User { get; set; } = new UserModel();
    }
    public class GotchaModel
    {
        public Guid CAPTCHA { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int UserId { get; set; }
        public bool IsUsed { get; set; } = false;
        public virtual UserModel User { get; set; } = new UserModel();
    }
}
