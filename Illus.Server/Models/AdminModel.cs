namespace Illus.Server.Models
{
    public enum AdminAccess : int
    {
        //管理者
        admin = 0,
        //主管
        manager = 1,
        //員工
        employee = 2
    }
    public class AdminModel
    {
        public int Id { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public int Access { get; set; } = 2;
        public bool IsEnable { get; set; } = false;
    }
}
