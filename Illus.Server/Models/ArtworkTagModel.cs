namespace Illus.Server.Models
{
    public class ArtworkTagModel
    {
        public int ArtworkId { get; set; }
        public int TagId { get; set; }
        public ArtworkModel? Artwork { get; set; }
        public TagModel? Tag { get; set; }
    }
}
