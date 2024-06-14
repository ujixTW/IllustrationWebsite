﻿namespace Illus.Server.Models.Command
{
    public enum SignUpErrorEnum : int
    {
        DataNotEnough = 0,
        PasseordLength = 1,
        AccountLength = 2,
        DuplicateEmail = 3,
    }
    public class LoginCommand
    {
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
    public class SignUpResult
    {
        public bool Success { get; set; }
        public string Error { get; set; } = string.Empty;
    }
}
