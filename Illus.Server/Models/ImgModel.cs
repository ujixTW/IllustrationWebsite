namespace Illus.Server.Models
{
    public class ImgModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public string ArtworkContent { get; set; } = string.Empty;
        public virtual ArtworkModel Artwork { get; set; } = new ArtworkModel();
    }
}
