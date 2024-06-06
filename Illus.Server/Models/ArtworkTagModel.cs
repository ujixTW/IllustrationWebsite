namespace Illus.Server.Models
{
    public class ArtworkTagModel
    {
        public int ArtworkId { get; set; }
        public int TagId { get; set; }
        public virtual ArtworkModel Artwork { get; set; } = new ArtworkModel();
        public virtual TagModel Tag { get; set; } = new TagModel();
    }
}
