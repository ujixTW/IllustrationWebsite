namespace Illus.Server.Models
{
    public class HistoryModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public int UserId { get; set; }
        public DateTime BrowseTime { get; set; }
        public ArtworkModel? Artwork { get; set; }
        public UserModel? User { get; set; }
    }
}
