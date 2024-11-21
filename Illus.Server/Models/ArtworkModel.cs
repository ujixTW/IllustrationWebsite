using Newtonsoft.Json;

namespace Illus.Server.Models
{
    public class ArtworkModel
    {
        public int Id { get; set; }
        public int ArtistId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImg { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int LikeCounts { get; set; }
        public int ReadCounts { get; set; }
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public DateTime PostTime { get; set; }
        public bool IsOpen { get; set; } = false;
        public bool IsDelete { get; set; } = false;
        [JsonIgnore]
        public virtual List<ImgModel> Images { get; set; } = new List<ImgModel>();
        [JsonIgnore]
        public virtual UserModel Artist { get; set; } = new UserModel();
        [JsonIgnore]
        public virtual List<TagModel> Tags { get; set; } = new List<TagModel>();
        [JsonIgnore]
        public virtual List<LikeModel> Likes { get; set; } = new List<LikeModel>();
    }
}
