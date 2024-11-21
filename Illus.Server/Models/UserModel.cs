using Newtonsoft.Json;

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
        public virtual LanguageModel Language { get; set; } = new LanguageModel();
        public virtual CountryModel Country { get; set; } = new CountryModel();
        [JsonIgnore]
        public virtual List<LoginTokenModel>? LoginTokens { get; set; }
        [JsonIgnore]
        public virtual GotchaModel? Gotcha { get; set; }
        [JsonIgnore]
        public virtual List<ArtworkModel> Artwork { get; set; } = [];
    }
    public class LoginTokenModel
    {
        public int Id { get; set; }
        public Guid LoginToken { get; set; }
        public int UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        [JsonIgnore]
        public virtual UserModel User { get; set; } = new UserModel();
    }
    public class GotchaModel
    {
        public Guid CAPTCHA { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int UserId { get; set; }
        public bool IsUsed { get; set; } = false;
        [JsonIgnore]
        public virtual UserModel User { get; set; } = new UserModel();
    }
}
