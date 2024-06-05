namespace Illus.Server.Models
{
    public class LikeModel
    {
        public int ArtworkId { get; set; }
        public int UserId { get; set; }
        public DateTime LikeTime { get; set; }
        public ArtworkModel? Artwork { get; set; }
        public UserModel? User { get; set; }
    }
}
