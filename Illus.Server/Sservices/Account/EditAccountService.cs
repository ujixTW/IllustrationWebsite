using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using Org.BouncyCastle.Asn1.Pkcs;
using System.Text;
using static Illus.Server.Helper.MailHelper;

namespace Illus.Server.Sservices.Account
{
    public class EditAccountService
    {
        private readonly IllusContext _context;
        private readonly int _captchaExpiryTime;
        private readonly int _maxLoginCount;
        public EditAccountService(IllusContext context)
        {
            _context = context;
            _captchaExpiryTime = 48;
            _maxLoginCount = 5;
        }
        public bool ForgetPassword(string email)
        {
            var success = true;
            try
            {
                var user = _context.User
                    .Include(p => p.Gotcha)
                    .Where(p => p.Email == email && p.IsActivation == true)
                    .SingleOrDefault();
                var captcha = Guid.NewGuid();
                var loginToken = Guid.NewGuid();

                #region 將驗證用資料存入資料庫
                if (user != null)
                {
                    var gotcha = new GotchaModel()
                    {
                        CAPTCHA = captcha,
                        ExpiryDate = DateTime.Now.AddHours(_captchaExpiryTime),
                        UserId = user.Id,
                        IsUsed = false
                    };
                    var userTokens = _context.LoginToken
                        .Where(p => p.UserId == user.Id)
                        .OrderBy(p => p.ExpiryDate)
                        .ToList();

                    var token = new LoginTokenModel()
                    {
                        LoginToken = loginToken,
                        UserId = user.Id,
                        ExpiryDate = DateTime.Now.AddHours(_captchaExpiryTime)
                    };

                    if (userTokens != null &&
                        userTokens.Count >= _maxLoginCount)
                    {
                        userTokens[0].User = token.User;
                        userTokens[0].LoginToken = token.LoginToken;
                        userTokens[0].ExpiryDate = token.ExpiryDate;
                    }
                    else if (userTokens != null)
                    {
                        userTokens.Add(token);
                    }
                    else
                    {
                        user.LoginTokens = new List<LoginTokenModel> { token };
                    }
                    user.Gotcha = gotcha;
                    _context.SaveChanges();
                }
                #endregion

                #region 寄信

                var userAccount = (user is null) ? string.Empty : user.Account;

                var emailContent =
                    $"<p>親愛的 {userAccount} 您好：" +
                    "<p>請點選下方連結，完成變更密碼的動作：</p>" +
                    $"<a href=\"https://localhost:5173/reset-password?apiKey={captcha}&pwrt={loginToken}\" style=\"background-color: rgb(238, 42, 42); color: white; text-decoration: none; font-size: 1.5rem; padding: 5px 15px; margin: 10px; border-radius: 5px;\">" +
                    "重設密碼</a>" +
                    "<p>如果您不打算重設密碼，則可以忽略此電子郵件，您的密碼將不會被更改。</p>" +
                    "<hr>" +
                    "<p>如果您尚未註冊IllusWebSite會員，並錯誤的收到了此封電子郵件，請忽略它。" +
                    "我們不會為您發送任何進一步的資訊。</p>";
                var mailData = new BaseMailDataModel()
                {
                    Recipient = userAccount,
                    RecipientEmail = email,
                    Subject = "IllusWebsite 密碼修改驗證碼",
                    Content = emailContent
                };

                SendMail(mailData);

                #endregion

            }
            catch (Exception ex)
            {
                Logger.WriteLog("ForgetPassword", ex);
                success = false;
            }
            return success;
        }
        public bool EditPWDFormEmail(EditPWDFormEmailCommand command)
        {
            var result = false;
            try
            {
                var nowTime = DateTime.Now;

                var user = _context.User
                    .Include(p => p.Gotcha)
                    .Where(p =>
                        p.Gotcha != null &&
                        p.Gotcha.CAPTCHA == command.CAPTCHA &&
                        p.Gotcha.ExpiryDate >= nowTime &&
                        p.IsActivation == true
                    )
                    .SingleOrDefault();

                var userToken = _context.LoginToken
                    .Where(p => p.LoginToken == command.Token && p.ExpiryDate >= nowTime)
                    .FirstOrDefault();

                //如果都找的到資料，且資料對的上，就更改密碼。
                if (user != null && userToken != null && user.Id == userToken.UserId)
                {
                    var pwds = command.PasswordCommand;
                    var saltBytes = Encoding.UTF8.GetBytes(user.PasswordSalt);
                    var oldPwdBytes = PWDHelper.GetHashPassword(user.Account, pwds.OldPWD, saltBytes);

                    if (user.Password == Convert.ToBase64String(oldPwdBytes))
                    {
                        var newSaltBytes = PWDHelper.BuildNewSalt();
                        var newSaltString = Convert.ToBase64String(newSaltBytes);
                        var newPwdHashBytes = PWDHelper.GetHashPassword(user.Account, pwds.NewPWD, newSaltBytes);
                        var newPwdHashString = Convert.ToBase64String(newPwdHashBytes);

                        user.Password = newPwdHashString;
                        user.PasswordSalt = newSaltString;

                        _context.SaveChanges();
                        result = true;
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditPWDFormEmail", ex);
            }

            return result;
        }
    }
}
