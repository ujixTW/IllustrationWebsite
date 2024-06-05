namespace Illus.Server.Models
{
    public class DailyThemeModel
    {
        public int Id { get; set; }
        public int TagId { get; set; }
        public int AdminId { get; set; }
        public DateTime SpecifyDay { get; set; }
        public bool IsEnable { get; set; }
        public TagModel? Tag { get; set; }
        public AdminModel? Admin { get; set; }
    }
}
