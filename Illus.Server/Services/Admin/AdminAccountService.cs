using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Illus.Server.Sservices.Admin
{
    public class AdminAccountService
    {
        private readonly IllusContext _context;
        private readonly int _pageCount;
        public AdminAccountService(IllusContext context)
        {
            _context = context;
            _pageCount = 24;
        }
        public bool CreateAdmin(AdminCommand command)
        {
            var result = false;
            try
            {
                var editor = _context.Admin
                    .AsNoTracking()
                    .Where(p => p.Id == command.EditorId &&
                        p.IsEnable == true &&
                        p.Access < (int)AdminAccess.manager)
                    .FirstOrDefault();

                if (editor != null && editor.Access > command.Access)
                {
                    var salt = PWDHelper.BuildNewSalt();
                    var pwdHash = PWDHelper.GetHashPassword(command.Account, command.Password, salt);

                    var newAdmin = new AdminModel
                    {
                        Account = command.Account,
                        Password = Convert.ToBase64String(pwdHash),
                        Salt = Convert.ToBase64String(salt),
                        Access = command.Access
                    };
                    _context.Admin.Add(newAdmin);
                    _context.SaveChanges();
                    result = true;
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("CreateAdmin", ex);
            }
            return result;
        }
        public bool EditAdmin(AdminCommand command)
        {
            var result = false;
            try
            {
                var admin = _context.Admin.SingleOrDefault(p => p.Id == command.Id && p.IsEnable == true);
                if (admin != null)
                {
                    var salt = Encoding.UTF8.GetBytes(admin.Salt);
                    var inputPwd = PWDHelper.GetHashPassword(command.Account, command.Password, salt);

                    if (Convert.ToBase64String(inputPwd) == admin.Password)
                    {
                        var hashPwd = PWDHelper.GetHashPassword(admin.Account, command.NewPwd, salt);
                        admin.Password = Convert.ToBase64String(hashPwd);
                        _context.SaveChanges();
                        result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditAdmin", ex);
            }
            return result;
        }
        public bool EditOtherAdmin(AdminCommand command)
        {
            var result = false;
            try
            {
                var editor = _context.Admin.AsNoTracking().SingleOrDefault(p => p.Id == command.EditorId && p.IsEnable == true);

                var admin = _context.Admin.SingleOrDefault(p => p.Id == command.Id && p.IsEnable == true);
                if (admin != null && editor != null)
                {
                    if (!string.IsNullOrWhiteSpace(command.Account)) admin.Account = command.Account;
                    if (!string.IsNullOrWhiteSpace(command.NewPwd))
                    {
                        var salt = Encoding.UTF8.GetBytes(admin.Salt);
                        var pwdHash = PWDHelper.GetHashPassword(admin.Account, command.NewPwd, salt);
                        admin.Password = Convert.ToBase64String(pwdHash);
                    }
                    if (command.Access > editor.Access) admin.Access = command.Access;

                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditOtherAdmin", ex);
            }
            return result;
        }
        public bool DeleteAdmin(int id)
        {
            var result = false;
            try
            {
                var admin = _context.Admin.SingleOrDefault(p => p.Id == id);
                if (admin != null)
                {
                    admin.IsEnable = false;
                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("DeleteAdmin", ex);
            }
            return result;
        }
        public async Task<AdminViewListModel> GetAdminList(int adminId, int p, string? name)
        {
            var result = new AdminViewListModel();
            try
            {
                var admin = _context.Admin.AsNoTracking()
                    .SingleOrDefault(p => p.Id == adminId && p.IsEnable == true);
                if (admin != null)
                {
                    var adminList = await _context.Admin
                        .AsNoTracking()
                        .Where(p =>
                            p.Access > admin.Access &&
                            p.IsEnable == true &&
                            (name != null) ? p.Account.Contains(name) : true)
                        .Skip(p * _pageCount)
                        .Take(_pageCount)
                        .ToListAsync();

                    foreach (var a in adminList)
                    {
                        result.Admins.Add(new AdminViewModel
                        {
                            Id = a.Id,
                            Account = a.Account,
                            Access = a.Access,
                        });
                    }

                    result.Count = _context.Admin.Count();
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetAdminList", ex);
            }
            return result;
        }
        public AdminViewModel? GetAdmin(int id)
        {
            AdminViewModel? result = null;
            try
            {
                var admin = _context.Admin
                    .AsNoTracking()
                    .FirstOrDefault(p => p.Id == id && p.IsEnable == true);

                if (admin != null)
                {
                    result = new AdminViewModel
                    {
                        Id = admin.Id,
                        Account = admin.Account,
                        Access = admin.Access,
                    };
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetAdmin", ex);
            }
            return result;
        }
        public bool CheckAdminRelationship(int editorId, int id)
        {
            var result = false;
            try
            {
                var admin = _context.Admin
                    .AsNoTracking()
                    .Select(p => new { p.Id, p.Access })
                    .Where(p => p.Id == editorId || p.Id == id)
                    .ToList();
                if (admin.Count == 2)
                {
                    if (admin[0].Id == editorId)
                    {
                        result = (admin[0].Access == (int)AdminAccess.admin) ?
                            true : admin[0].Access > admin[1].Access;
                    }
                    else
                    {
                        result = (admin[1].Access == (int)AdminAccess.admin) ?
                            true : admin[1].Access > admin[0].Access;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("CheckAdminRelationship", ex);
            }
            return result;
        }

    }
}
