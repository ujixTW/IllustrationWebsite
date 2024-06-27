namespace Illus.Server.Models
{
    public class ImgModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public virtual ArtworkModel Artwork { get; set; } = new ArtworkModel();
        public string ArtworkContent { get; set; } = string.Empty;
    }
}
