﻿using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Illus.Server.Sservices.Account
{
    public class LoginService
    {
        private readonly IllusContext _illusContext;
        private readonly int _captchaExpiryTime;
        private readonly int _maxLoginCount;
        public LoginService(IllusContext illusContext)
        {
            _illusContext = illusContext;
            _captchaExpiryTime = 48;
            _maxLoginCount = 5;
        }
        /// <summary>
        /// CAPTCHA失效時間(小時)
        /// </summary>
        public LoginTokenModel? Login(LoginCommand command)
        {
            var success = false;
            var result = new LoginTokenModel();
            try
            {
                var user = _illusContext.User
                .AsNoTracking()
                .SingleOrDefault(p =>
                    (p.Account == command.Account || p.Email == command.Email) &&
                    p.IsActivation == true
                );

                if (user != null)
                {
                    var salt = Encoding.UTF8.GetBytes(user.PasswordSalt);
                    var inputPwd = PWDHelper.GetHashPassword(user.Account, command.Password, salt);
                    if (user.Password == Convert.ToBase64String(inputPwd))
                    {
                        var tokenData = new LoginTokenModel()
                        {
                            LoginToken = Guid.NewGuid(),
                            UserId = user.Id,
                            ExpiryDate = DateTime.Now.AddYears(50)
                        };
                        var token = _illusContext
                            .LoginToken
                            .Where(p => p.UserId == user.Id)
                            .OrderBy(p => p.ExpiryDate)
                            .ToList();

                        if (token.Count >= _maxLoginCount)
                        {
                            token[0].LoginToken = tokenData.LoginToken;
                            token[0].ExpiryDate = tokenData.ExpiryDate;
                        }
                        else
                        {
                            token.Add(tokenData);
                        }

                        _illusContext.SaveChanges();
                        result = tokenData;
                        success = true;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("Login", ex);
            }

            if (!success) result = null;

            return result;
        }
        public UserViewModel? LoginCheck(LoginTokenModel input)
        {
            UserViewModel? result = null;
            var today = DateTime.Now;
            try
            {
                var hasData = _illusContext.LoginToken
                    .AsNoTracking()
                    .SingleOrDefault(p =>
                    p.LoginToken == input.LoginToken &&
                    p.UserId == input.UserId &&
                    p.User.IsActivation == true &&
                    p.ExpiryDate > today
                );

                if (hasData != null)
                {
                    var user = _illusContext.User
                        .AsNoTracking()
                        .Include(p => p.Language)
                        .Include(p => p.Country)
                        .SingleOrDefault(p => p.Id == input.UserId);

                    result = user == null ?
                        null :
                        new UserViewModel()
                        {
                            Id = user.Id,
                            Account = user.Account,
                            Email = user.Email,
                            NickName = user.Nickname,
                            Profile = user.Profile,
                            Language = user.Language.Content,
                            Country = user.Country.Content,
                            CoverContent = user.CoverContent,
                            HeadshotContent = user.HeadshotContent,
                        };
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("LoginCheck", ex);
            }
            return result;
        }
        public bool Logout(int userId, Guid token)
        {
            var result = false;
            try
            {
                var model = _illusContext.LoginToken
                    .SingleOrDefault(p => p.LoginToken == token && p.UserId == userId);
                if (model != null)
                {
                    model.ExpiryDate = DateTime.Now;
                    _illusContext.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("Logout", ex);
            }
            return result;
        }
        public SignUpResult SignUp(LoginCommand command)
        {
            var result = new SignUpResult();
            try
            {
                var hasData = _illusContext.User
                .AsNoTracking()
                .SingleOrDefault(p =>
                    p.Email == command.Email ||
                    p.Account == command.Account
                );
                //若資料庫內沒有資料就創建一個傳入資料庫中，
                //否則回傳錯誤
                if (hasData == null)
                {
                    var saltBytes = PWDHelper.BuildNewSalt();
                    var saltString = Convert.ToBase64String(saltBytes);
                    var pwdBytes = PWDHelper.GetHashPassword(command.Account, command.Password, saltBytes);
                    var pwd = Convert.ToBase64String(pwdBytes);

                    var capcha = Guid.NewGuid();

                    var user = new UserModel
                    {
                        Account = command.Account,
                        Password = pwd,
                        PasswordSalt = saltString,
                        Email = command.Email,
                        CreateTime = DateTime.Now,
                        EmailConfirmed = false,
                        IsActivation = false,
                        Gotcha = new GotchaModel
                        {
                            CAPTCHA = capcha,
                            ExpiryDate = DateTime.Now.AddHours(_captchaExpiryTime),
                        }
                    };

                    result.Success = MailHelper.SendSignUpMail(user);

                    _illusContext.User.Add(user);
                    _illusContext.SaveChanges();
                }
                else
                {
                    var errorString = string.Empty;
                    if (hasData.Email == command.Email)
                    {
                        errorString = "DUPLICATE EMAIL";
                    }
                    else if (hasData.Account == command.Account)
                    {
                        errorString = "DUPLICATE ACCOUNT";
                    }
                    result.Success = false;
                    result.Error = errorString;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("Illus.Server/Sservices/SignUp", ex);
                result.Success = false;
                result.Error = "ACCESS DENIED";
            }

            return result;
        }
        public SignUpResult Comfirm(Guid guid)
        {
            var result = new SignUpResult();
            var today = DateTime.Now;
            try
            {
                var gotcha = _illusContext.Gotcha
                    .SingleOrDefault(p =>
                    p.CAPTCHA == guid &&
                    p.ExpiryDate >= today &&
                    p.IsUsed == false &&
                    p.User.EmailConfirmed == false
                );
                if (gotcha != null && !gotcha.IsUsed)
                {
                    var user = _illusContext.User
                        .Single(p => p.Id == gotcha.UserId);
                    user.EmailConfirmed = true;
                    user.IsActivation = true;
                    gotcha.IsUsed = true;

                    var token = Guid.NewGuid();
                    var tokenData = new LoginTokenModel()
                    {
                        LoginToken = token,
                        ExpiryDate = today.AddYears(50)
                    };
                    user.LoginTokens = new List<LoginTokenModel> { tokenData };

                    _illusContext.SaveChanges();
                    result.Success = true;
                    result.UserId = user.Id;
                    result.Token = token;
                }
                else
                {
                    result.Success = false;
                    result.Error = "INVALID CAPTCHA";
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("Comfirm", ex);
                result.Success = false;
                result.Error = "ACCESS DENIED";
            }

            return result;
        }
        public SignUpResult ConfirmAgain(Guid guid)
        {
            var result = new SignUpResult();
            try
            {
                var user = _illusContext.User
                .Include(p => p.Gotcha)
                .SingleOrDefault(p =>
                    p.EmailConfirmed == false &&
                    p.IsActivation == false &&
                    p.Gotcha != null &&
                    p.Gotcha.CAPTCHA == guid &&
                    p.Gotcha.IsUsed == false
                );

                if (user != null)
                {
                    var captcha = Guid.NewGuid();
                    user.Gotcha!.CAPTCHA = captcha;
                    user.Gotcha!.ExpiryDate = DateTime.Now.AddHours(_captchaExpiryTime);

                    _illusContext.SaveChanges();
                    result.Success = MailHelper.SendSignUpMail(user);
                }
                else
                {
                    result.Success = false;
                    result.Error = "NO DATA";
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("ConfirmAgain", ex);
                result.Success = false;
                result.Error = "ACCESS DENIED";
            }

            return result;
        }

    }
}