namespace Illus.Server.Models
{
    public class ImgModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public string ArtworkContent { get; set; } = string.Empty;
        public ArtworkModel? Artwork { get; set; }
    }
}
