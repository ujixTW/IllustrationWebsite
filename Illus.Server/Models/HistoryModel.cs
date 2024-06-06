namespace Illus.Server.Models
{
    public class HistoryModel
    {
        public int Id { get; set; }
        public int? ArtworkId { get; set; }
        public int UserId { get; set; }
        public DateTime BrowseTime { get; set; }
        public virtual ArtworkModel? Artwork { get; set; }
        public virtual UserModel User { get; set; } = new UserModel();
    }
}
