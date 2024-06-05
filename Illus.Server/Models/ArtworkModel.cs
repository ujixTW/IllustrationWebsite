﻿namespace Illus.Server.Models
{
    public class ArtworkModel
    {
        public int Id { get; set; }
        public int ArtistId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsR18 { get; set; }
        public bool IsAI { get; set; }
        public DateTime PostTime { get; set; }
        public bool IsOpen { get; set; }
        public bool IsDelete { get; set; }
        public virtual UserModel? Artist { get; set; }
    }
}
