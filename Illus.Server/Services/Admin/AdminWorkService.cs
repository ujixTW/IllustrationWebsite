using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Services.Admin
{
    public class AdminWorkService
    {
        private readonly IllusContext _context;
        public AdminWorkService(IllusContext context)
        {
            _context = context;
        }
        public async Task<DailyThemListModel> GetDailyThemList(DailyTagListCommand command)
        {
            var result = new DailyThemListModel();
            try
            {
                var themList = _context.DailyTheme
                    .AsNoTracking()
                    .Include(p => p.Tag)
                    .Include(p => p.Admin)
                    .Where(p =>
                        p.IsEnable == true &&
                        (command.StartTime != null) ?
                            p.SpecifyDay > command.StartTime : true &&
                        (command.EndTime != null) ?
                            p.SpecifyDay < command.EndTime : true &&
                        (command.TagId != null) ?
                            p.TagId == command.TagId : true &&
                        (command.AdminId != null) ?
                            p.AdminId == command.AdminId : true);

                if (command.IsDesc)
                    themList.OrderBy(p => p.SpecifyDay).ThenBy(p => p.Id);
                else
                    themList.OrderByDescending(p => p.SpecifyDay).ThenByDescending(p => p.Id);

                result.Count = themList.Count();

                var takeC = 30;

                await themList.Skip(command.Page * takeC).Take(takeC).ToListAsync();

                foreach (var them in themList)
                {
                    var temp = them;
                    temp.Admin = new AdminModel
                    {
                        Id = them.Admin.Id,
                        Account = them.Admin.Account,
                    };
                    result.Themes.Add(temp);
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetDailyThemList", ex);
            }
            return result;
        }
        public DailyThemeModel GetDailyThem(int id)
        {
            var result = new DailyThemeModel();
            try
            {
                var them = _context.DailyTheme
                    .AsNoTracking()
                    .Include(p => p.Tag)
                    .Include(p => p.Admin)
                    .SingleOrDefault(p => p.Id == id && p.IsEnable == true);
                if (them != null)
                {
                    result = them;
                    result.Admin = new AdminModel
                    {
                        Id = them.Admin.Id,
                        Account = them.Admin.Account
                    };
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetDailyThem", ex);
            }
            return result;
        }
        public async Task<bool> AddDailyThem(DailyThemeModel command)
        {
            var result = false;
            try
            {
                var tag = _context.Tag.AsNoTracking().SingleOrDefault(p => p.Id == command.TagId);
                var admin = _context.Admin.AsNoTracking().SingleOrDefault(p => p.Id == command.AdminId && p.IsEnable == true);
                if (tag != null && admin != null)
                {
                    var themList = await _context.DailyTheme
                            .Where(p => p.IsEnable == true && p.SpecifyDay == command.SpecifyDay)
                            .ToListAsync();

                    if (themList.Any())
                        foreach (var them in themList)
                            them.IsEnable = false;

                    await _context.DailyTheme.AddAsync(new DailyThemeModel
                    {
                        TagId = command.TagId,
                        AdminId = command.AdminId,
                        SpecifyDay = command.SpecifyDay,
                        IsEnable = true
                    });

                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("AddDailyThem", ex);
            }
            return result;
        }
        public async Task<bool> EditDailyThem(DailyThemeModel command)
        {
            var result = false;
            try
            {
                var them = _context.DailyTheme
                    .Where(p => p.Id == command.Id && p.IsEnable == true)
                    .SingleOrDefault();
                var tag = _context.Tag.AsNoTracking().SingleOrDefault(p => p.Id == command.TagId);
                var admin = _context.Admin.AsNoTracking().SingleOrDefault(p => p.Id == command.AdminId && p.IsEnable == true);

                if (them != null && tag != null && admin != null)
                {
                    if (them.TagId != command.TagId ||
                        them.SpecifyDay != command.SpecifyDay ||
                        them.IsEnable != command.IsEnable)
                    {
                        var themList = await _context.DailyTheme
                            .Where(p => p.IsEnable == true && p.SpecifyDay == command.SpecifyDay)
                            .ToListAsync();

                        if (command.IsEnable == true)
                        {
                            foreach (var item in themList)
                            {
                                item.IsEnable = false;
                            }
                        }

                        them.SpecifyDay = command.SpecifyDay;
                        them.IsEnable = command.IsEnable;
                        them.TagId = command.TagId;
                        them.AdminId = command.AdminId;

                        _context.SaveChanges();
                        result = true;
                    }

                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditDailyThem", ex);
            }
            return result;
        }
    }
}
