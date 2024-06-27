namespace Illus.Server.Models
{
    public class TagModel
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public virtual List<ArtworkModel> Artworks { get; set; } = new List<ArtworkModel>();
    }
}
