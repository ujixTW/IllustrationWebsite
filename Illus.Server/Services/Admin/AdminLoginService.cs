using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Illus.Server.Services.Admin
{
    public class AdminLoginService
    {
        private readonly IllusContext _context;
        public AdminLoginService(IllusContext context)
        {
            _context = context;
        }
        public AdminModel? Login(LoginCommand command)
        {
            AdminModel? result = null;
            try
            {
                var admin = _context.Admin
                    .AsNoTracking()
                    .FirstOrDefault(p => p.Account == command.Account && p.IsEnable == true);
                if (admin != null)
                {
                    var pwdHash = PWDHelper.GetHashPassword(command.Account, command.Password, Encoding.UTF8.GetBytes(admin.Salt));

                    if (Convert.ToBase64String(pwdHash) == admin.Password)
                    {
                        result = new AdminModel
                        {
                            Id = admin.Id,
                            Account = admin.Account,
                            Access = admin.Access,
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("AdminLogin", ex);
            }
            return result;
        }
    }
}
