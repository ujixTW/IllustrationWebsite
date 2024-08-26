using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Web;
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
        public bool EditAccount(string inputAccount, int userId)
        {
            var result = false;
            try
            {

                var user = _context.User.SingleOrDefault(p => p.Id.Equals(userId));
                if (user != null)
                {
                    var accUsable = _context.User
                        .AsNoTracking()
                        .SingleOrDefault(p => p.Account.Equals(inputAccount)) == null;

                    if (accUsable)
                    {
                        user.Account = inputAccount;
                        _context.SaveChanges();
                        result = true;
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditAccount", ex);
            }
            return result;
        }
        public bool EditEmail(string inputEmail, int userId)
        {
            var result = false;
            try
            {

                var user = _context.User
                    .Include(p => p.Gotcha)
                    .SingleOrDefault(p => p.Id.Equals(userId));

                if (user != null)
                {
                    var emailUsable = _context.User
                        .AsNoTracking()
                        .SingleOrDefault(p => p.Email.Equals(inputEmail)) == null;

                    if (emailUsable)
                    {
                        var captcha = Guid.NewGuid();
                        #region 修改資料庫

                        user.Email = inputEmail;
                        user.EmailConfirmed = false;
                        user.Gotcha = new GotchaModel
                        {
                            CAPTCHA = captcha,
                            ExpiryDate = DateTime.Now.AddHours(_captchaExpiryTime),
                            UserId = userId,
                            IsUsed = false
                        };

                        #endregion

                        #region 寄信
                        var userName = (string.IsNullOrWhiteSpace(user.Nickname)) ?
                            user.Account : user.Nickname;

                        var emailContent =
                    $"<p>親愛的 {userName} 您好：" +
                    "<p>請點選下方連結，完成信箱認證：</p>" +
                    $"<a href=\"https://localhost:5173/account/email/confirm?apiKey={captcha}\" style=\"background-color: rgb(238, 42, 42); color: white; text-decoration: none; font-size: 1.5rem; padding: 5px 15px; margin: 10px; border-radius: 5px;\">" +
                    "認證信箱</a>";

                        var mailData = new BaseMailDataModel()
                        {
                            Recipient = userName,
                            RecipientEmail = inputEmail,
                            Subject = "IllusWebsite 更改信箱認證信",
                            Content = emailContent
                        };

                        SendMail(mailData);
                        #endregion
                        _context.SaveChanges();
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditEmail", ex);
            }
            return result;
        }
        public bool EditEmailComfirm(Guid captcha)
        {
            var result = false;
            try
            {
                var gotcha = _context.Gotcha
                    .Include(p => p.User)
                    .SingleOrDefault(p => p.CAPTCHA == captcha && p.IsUsed == false);

                if (gotcha != null)
                {
                    var user = gotcha.User;
                    user.EmailConfirmed = true;
                    gotcha.IsUsed = true;
                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditEmailComfirm", ex);
            }
            return result;
        }
        public bool EditPassword(EditPasswordCommand command, int userId)
        {
            var result = false;
            try
            {
                var user = _context.User.SingleOrDefault(p => p.Id == userId);
                if (user != null)
                {
                    if (string.Equals(user.Password, command.OldPWD)) user.Password = command.NewPWD;
                    _context.SaveChanges();
                    result = true;
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditPassword", ex);
            }
            return result;
        }
        public bool ForgetPassword(string email)
        {
            var success = true;
            try
            {
                var user = _context.User
                    .Include(p => p.Gotcha)
                    .Where(p => p.Email == email && p.EmailConfirmed == true && p.IsActivation == true)
                    .SingleOrDefault();
                var captcha = Guid.NewGuid();

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
                    user.Gotcha = gotcha;
                    _context.SaveChanges();
                }
                #endregion

                #region 寄信
                if (user != null)
                {
                    var userName = (string.IsNullOrWhiteSpace(user.Nickname)) ?
                            user.Account : user.Nickname;

                    var emailContent =
                        $"<p>親愛的 {userName} 您好：" +
                        "<p>為確認您的信箱地址，請將下列認證碼輸入至確認頁面：</p>" +
                        $"<p style=\"margin: 2rem 0; font-size: 1.5rem;\">{captcha}</p>" +
                        "重設密碼</a>" +
                        "<hr/>" +
                        "<p>※此封郵件為系統自動發送。無法直接回覆此郵件。敬請見諒。</p>" +
                        "<p>※若並未進行密碼重置，可能是因為他人輸入了錯誤的信箱地址而導致您收到此郵件。可直接刪除此郵件。</p>";
                    var mailData = new BaseMailDataModel()
                    {
                        Recipient = userName,
                        RecipientEmail = email,
                        Subject = "IllusWebsite 密碼修改驗證碼",
                        Content = emailContent
                    };

                    SendMail(mailData);
                }

                #endregion

            }
            catch (Exception ex)
            {
                Logger.WriteLog("ForgetPassword", ex);
                success = false;
            }
            return success;
        }
        public bool EditPWDFormEmail(EditPWDFromEmailCommand command)
        {
            var result = false;
            try
            {
                var nowTime = DateTime.Now;

                var user = _context.User
                    .Include(p => p.Gotcha)
                    .Where(p =>
                        p.Email == command.Email &&
                        p.Gotcha != null &&
                        p.Gotcha.CAPTCHA == command.CAPTCHA &&
                        p.Gotcha.ExpiryDate >= nowTime &&
                        p.IsActivation == true
                    )
                    .SingleOrDefault();
                if (user != null)
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

                        if (user.Gotcha != null)
                        {
                            user.Gotcha.ExpiryDate = nowTime;
                            user.Gotcha.IsUsed = true;
                        }

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
        public async Task<bool> EditUserData(EditUserDataCommand command)
        {
            var result = false;
            command.NickName = HttpUtility.HtmlEncode(command.NickName.Trim());
            command.Profile = HttpUtility.HtmlEncode(command.Profile);
            try
            {
                var userName = _context.User
                    .AsNoTracking()
                    .Select(p => new { p.Nickname, p.Id })
                    .SingleOrDefault(p => p.Nickname == command.NickName && p.Id != command.Id);

                if (userName != null)
                {
                    var user = _context.User.SingleOrDefault(p => p.Id.Equals(command.Id));
                    if (user != null)
                    {
                        if (!string.IsNullOrWhiteSpace(command.NickName)) user.Nickname = command.NickName;
                        user.Profile = command.Profile;
                        user.LanguageId = command.LanguageiD;
                        user.CountryID = command.CountryiD;

                        if (command.cover != null && FileHelper.IsImage(command.cover))
                        {
                            user.CoverContent = await FileHelper.SaveImageAsync(command.cover, command.Id, (int)FileHelper.imgType.userCover);
                        }

                        if (command.headshot != null && FileHelper.IsImage(command.headshot))
                        {
                            user.HeadshotContent = await FileHelper.SaveImageAsync(command.headshot, command.Id, (int)FileHelper.imgType.userCover);
                        }

                        _context.SaveChanges();
                        result = true;
                    }
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditUserData", ex);
            }

            return result;
        }
        /// <summary>
        /// 檢查使用者身分與傳入資料身分是否一致
        /// </summary>
        /// <param name="token">登入token</param>
        /// <param name="id">使用者Id</param>
        /// <returns></returns>
        public bool CheckUserIdentity(Guid token, int id)
        {
            var tokenData = _context.LoginToken
                .AsNoTracking()
                .SingleOrDefault(p => p.LoginToken.Equals(token));
            return (tokenData != null && tokenData.UserId == id);
        }
    }
}
