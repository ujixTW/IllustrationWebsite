namespace Illus.Server.Models
{
    public class LikeCountModel
    {
        public int ArtworkId { get; set; }
        public int Likes { get; set; }
        public virtual ArtworkModel? Artwork { get; set; }
    }
}
