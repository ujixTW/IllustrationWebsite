namespace Illus.Server.Models.View
{
    public class UserViewModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string NickName { get; set; } = string.Empty;
        public string? Profile { get; set; }
        public string? CoverContent { get; set; }
        public string? HeadshotContent { get; set; }
        public bool IsFollow { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public LanguageModel Language { get; set; } = new LanguageModel();
        public CountryModel Country { get; set; } = new CountryModel();
        public ArtworkViewListModel ArtworkList { get; set; } = new ArtworkViewListModel();
    }
    public class FollowViewListModel
    {
        public List<UserViewModel> Users { get; set; } = [];
        public int Count { get; set; }
    }
}
