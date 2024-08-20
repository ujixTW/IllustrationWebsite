using System.Text.RegularExpressions;
using System.Web;

namespace Illus.Server.Helper
{
    public class StringHelper
    {
        public static string RemoveHtml(string input)
        {
            var text = HttpUtility.HtmlDecode(input);
            return Regex.Replace(text, "<[a-zA-Z/].*?>", string.Empty);
        }
        public static bool HasHtml(string input)
        {
            var text = HttpUtility.HtmlDecode(input);
            return Regex.IsMatch(text, @"<[a-zA-Z/].*?>");
        }
        public static bool IsValidEmail(string email)
        {
            var reg = @"^\w+((-\w+)|(\.\w+)|(\+\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-za-z]+$";
            return _isValidString(email, reg, true);
        }
        public static bool IsValidAccount(string account)
        {
            var reg = @"^[a-zA-Z0-9]${6,16}";
            return _isValidString(account, reg, false);
        }
        public static bool IsValidPassword(string password)
        {
            var reg = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[0-9a-zA-Z!@#$.\%\^\&\*\(\)]${6,32}";
            return _isValidString(password, reg, false);
        }
        private static bool _isValidString(string input, string reg, bool IgnoreCase)
        {
            if (string.IsNullOrWhiteSpace(input)) return false;
            try
            {
                if (IgnoreCase)
                {
                    return Regex.IsMatch(input,
                    reg,
                    RegexOptions.IgnoreCase,
                    TimeSpan.FromMilliseconds(250));
                }
                else
                {
                    return Regex.IsMatch(input,
                    reg, RegexOptions.None,
                    TimeSpan.FromMilliseconds(250));
                }

            }
            catch (RegexMatchTimeoutException e)
            {
                Logger.WriteLog("IsValidString", e);
                return false;
            }
        }
    }
}
