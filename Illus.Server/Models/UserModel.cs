namespace Illus.Server.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Nickname { get; set; } = string.Empty;
        public string? Profile { get; set; }
        public int LanguageId { get; set; }
        public int CountryID { get; set; }
        public string? CoverContent { get; set; }
        public string? HeadshotContent { get; set; }
        public DateTime CreateTime { get; set; }
        public bool IsActivation { get; set; }
        public virtual LanguageModel? Language { get; set; }
        public virtual CountryModel? Country { get; set; }
    }
}
