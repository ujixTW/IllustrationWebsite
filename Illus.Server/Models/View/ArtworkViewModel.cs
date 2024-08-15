namespace Illus.Server.Models.View
{
    public class ArtworkViewModel
    {
        public int Id { get; set; }
        public int ArtistId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CoverImg { get; set; } = string.Empty;
        public int LikeCounts { get; set; }
        public int ReadCounts { get; set; }
        public bool IsLike { get; set; }
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public DateTime PostTime { get; set; }
        public string ArtistName { get; set; } = string.Empty;
        public string ArtistHeadshotContent { get; set; } = string.Empty;
        public List<TagModel> Tags { get; set; } = [];
        public List<ImgModel> Imgs { get; set; } = [];
    }
    public class ArtworkViewListModel
    {
        public List<ArtworkViewModel> ArtworkList { get; set; } = new List<ArtworkViewModel>();
        public int MaxCount { get; set; }
        public string DailyTheme { get; set; } = string.Empty;
    }
}
