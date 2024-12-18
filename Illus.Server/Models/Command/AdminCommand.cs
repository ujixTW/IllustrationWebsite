﻿namespace Illus.Server.Models.Command
{
    public class AdminCommand
    {
        public int Id { get; set; }
        public int EditorId { get; set; }
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string NewPwd { get; set; } = string.Empty;
        public string NewPwdAgain { get; set; } = string.Empty;
        public int Access { get; set; } = 2;
        public bool IsEnable { get; set; } = true;
    }
    public class DailyTagListCommand
    {
        public int Page { get; set; }
        public bool IsDesc { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? TagId { get; set; }
        public int? AdminId { get; set; }
    }
}
