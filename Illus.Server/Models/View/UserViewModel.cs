namespace Illus.Server.Models.View
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string NickName { get; set; } = string.Empty;
        public string? Profile { get; set; }
        public string? Cover { get; set; }
        public string? Headshot { get; set; }
        public bool IsFollow { get; set; }
        public bool EmailConfirm { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public LanguageModel Language { get; set; } = new LanguageModel();
        public CountryModel Country { get; set; } = new CountryModel();
        public ArtworkViewListModel ArtworkList { get; set; } = new ArtworkViewListModel();
    }
    public class LoginCheckModel
    {
        public UserViewModel? UserData { get; set; }
        public bool IsLogin { get; set; }
    }
    public class FollowViewListModel
    {
        public List<UserViewModel> Users { get; set; } = [];
        public int Count { get; set; }
    }
}
