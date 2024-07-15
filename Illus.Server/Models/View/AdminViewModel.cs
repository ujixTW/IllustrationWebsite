namespace Illus.Server.Models.View
{
    public class AdminViewModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public int Access { get; set; }
    }
    public class AdminViewListModel
    {
        public List<AdminViewModel> Admins { get; set; } = [];
        public int Count { get; set; }
    }
    public class DailyThemListModel
    {
        public List<DailyThemeModel> Themes { get; set; } = [];
        public int Count { get; set; }
    }
}
