using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Sservices
{
    public class LoginService
    {
        private readonly IllusContext _illusContext;
        public LoginService(IllusContext illusContext)
        {
            _illusContext = illusContext;
        }
        public SignUpResult SignUp(LoginCommand command)
        {
            var hasData = _illusContext.User
                .AsNoTracking()
                .Single(p =>
                    p.Email == command.Email ||
                    p.Account == command.Account
                );
            var model = new SignUpResult();

            if (hasData == null)
            {
                var saltBytes = PWDHelper.BuildNewSalt();
                var saltString = Convert.ToBase64String(saltBytes);
                var pwdBytes = PWDHelper.GetHashPassword(command.Account, command.Password, saltBytes);
                var pwd = Convert.ToBase64String(pwdBytes);

                var user = new UserModel
                {
                    Account = command.Account,
                    Password = pwd,
                    PasswordSalt = saltString,
                    Email = command.Email,
                };
                model.Success = true;
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
                model.Success = false;
                model.Error = errorString;
            }
            return model;
        }
    }
}
