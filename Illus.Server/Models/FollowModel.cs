namespace Illus.Server.Models
{
    public class FollowModel
    {
        public int FollowerId { get; set; }
        public int FollowingId { get; set; }
        public DateTime FollowTime { get; set; }
        public virtual UserModel Follower { get; set; } = new UserModel();
        public virtual UserModel Following { get; set;} = new UserModel();
    }
}
