﻿namespace Illus.Server.Models.Command
{
    public class LoginCommand
    {
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
