using Illus.Server.Models;
using MailKit.Net.Smtp;
using MimeKit;

namespace Illus.Server.Helper
{
    public class MailHelper
    {
        public class BaseMailDataModel
        {
            public string Sender { get; set; } = "IllusWebSite";
            public string SenderEmail { get; set; } = "IllusWebSite@IllusWeb.com";
            /// <summary>
            /// 收件人
            /// </summary>
            public string Recipient { get; set; } = string.Empty;
            /// <summary>
            /// 收件人信箱
            /// </summary>
            public string RecipientEmail { get; set; } = string.Empty;
            ///<summary>標題</summary>
            public string Subject { get; set; } = string.Empty;
            public string Content { get; set; } = string.Empty;
        }
        /// <summary>
        /// 寄送註冊認證信件
        /// </summary>
        /// <param name="user">包含帳號、信箱、CAPTCHA的UserModel</param>
        public static bool SendSignUpMail(UserModel user)
        {
            if (
                string.IsNullOrEmpty(user.Account) ||
                string.IsNullOrEmpty(user.Email) ||
                user.Gotcha is null
                )
            {
                return false;
            }
            var mail = new BaseMailDataModel();
            mail.Sender = "IllusWebSite";
            mail.SenderEmail = "IllusWebSite@IllusWeb.com";
            mail.Recipient = user.Account;
            mail.RecipientEmail = user.Email;
            mail.Subject = "IllusWebsite 註冊認證";
            mail.Content =
               "<h1 style=\"text-align: center;\">IllusWebsite 註冊認證</h1>" +
               "<p>請點擊下方按鈕完成註冊：</p>" +
               $"<a href=\"https://localhost:5173/confirm/{user.Gotcha.CAPTCHA}\" style=\"background-color: rgb(238, 42, 42); color: white; text-decoration: none; font-size: 1.5rem; padding: 5px 15px; margin: 10px; border-radius: 5px;\" >完成註冊</a>" +
               "<p>若無法點擊按鈕，請複製下方網址並貼到瀏覽器的網址列上：</p>" +
               $"<a href=\"https://localhost:5173/confirm/{user.Gotcha.CAPTCHA}\">https://localhost:5173/confirm/{user.Gotcha.CAPTCHA}</a>" +
               "<p>此連結將於48小時候失效，若逾期，請" +
               $"<a href\"https://localhost:5173/confirm-again/{user.Gotcha.CAPTCHA}\">點此重新寄送驗證信</a>" +
               "。</p>";

            SendMail(mail);

            return true;
        }
        /// <summary>
        /// 寄送不含附件的電子郵件
        /// </summary>
        /// <param name="mail">須包含寄件人、寄件人信箱、收件人、收件人信箱、標題、內容</param>
        public static void SendMail(BaseMailDataModel mail)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(mail.Sender, mail.SenderEmail));
            message.To.Add(new MailboxAddress(mail.Recipient, mail.RecipientEmail));
            message.Subject = mail.Subject;
            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
{mail.Content}";
            message.Body = bodyBuilder.ToMessageBody();
            SendToRecipient(message);
        }
        /// <summary>
        /// 實行寄送動作
        /// </summary>
        /// <param name="message">信件本體</param>
        private static void SendToRecipient(MimeMessage message)
        {
            var hostUrl = "smtp.gmail.com";
            var port = 465;
            var useSsl = true;
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Connect(hostUrl, port, useSsl);
                    client.Authenticate("IllusWebsite202406@gmail.com", "jjphbiauygkvlnji");
                    client.Send(message);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("SendToRecipient", ex);
            }
        }

    }
}
