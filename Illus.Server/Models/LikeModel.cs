namespace Illus.Server.Models
{
    public class LikeModel
    {
        public int ArtworkId { get; set; }
        public int UserId { get; set; }
        public DateTime LikeTime { get; set; }
        public virtual ArtworkModel? Artwork { get; set; }
        public virtual UserModel? User { get; set; }
    }
}
