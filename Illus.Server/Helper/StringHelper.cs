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
            if (string.IsNullOrWhiteSpace(email)) return false;

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$", 
                    RegexOptions.IgnoreCase, 
                    TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException e)
            {
                return false;
            }
        }
    }
}
