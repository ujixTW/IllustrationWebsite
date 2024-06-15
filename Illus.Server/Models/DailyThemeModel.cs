namespace Illus.Server.Models
{
    public class DailyThemeModel
    {
        public int Id { get; set; }
        public int TagId { get; set; }
        public int AdminId { get; set; }
        public DateTime SpecifyDay { get; set; }
        public bool IsEnable { get; set; } = false;
        public virtual TagModel Tag { get; set; } = new TagModel();
        public virtual AdminModel Admin { get; set; } = new AdminModel();
    }
}
