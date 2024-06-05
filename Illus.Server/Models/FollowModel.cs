namespace Illus.Server.Models
{
    public class FollowModel
    {
        public int FollowerId { get; set; }
        public int FollowingId { get; set; }
        public DateTime FollowTime { get; set; }
        public virtual UserModel? Follower { get; set; }
        public virtual UserModel? Followeing { get; set; }
    }
}
