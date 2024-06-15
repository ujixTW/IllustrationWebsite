namespace Illus.Server.Models
{
    public class MassageModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public int UserId { get; set; }
        public string content { get; set; } = string.Empty;
        public DateTime CreateTime { get; set; }
        public bool IsEdit { get; set; } = false;
        public bool IsDelete { get; set; } = false;
        public virtual ArtworkModel? Artwork { get; set; }
        public virtual UserModel? User { get; set; }
    }
}
