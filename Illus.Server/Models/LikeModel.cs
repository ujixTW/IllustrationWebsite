namespace Illus.Server.Models
{
    public class LikeModel
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public int UserId { get; set; }
        public bool Status { get; set; } = true;
        public DateTime CreateTime { get; set; }
        public DateTime? UpdateTime { get; set; }
        public virtual ArtworkModel Artwork { get; set; }=new ArtworkModel();
        public virtual UserModel User { get; set; } = new UserModel();
    }
}
