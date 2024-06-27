using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Sservices.Works
{
    public class WorkService
    {
        private readonly IllusContext _context;
        public WorkService(IllusContext context)
        {
            _context = context;
        }
        public List<ArtworkViewModel> GetWorkList(WorkListCommand command)
        {
            var keywordList = new List<string>();

            if (!string.IsNullOrEmpty(command.Keywords))
                keywordList = command.Keywords.Trim().Split(' ').ToList();

            var workList = new List<ArtworkViewModel>();
            try
            {
                var today = DateTime.Now;
                var list = _context.Artwork
                    .AsNoTracking()
                    .Include(p => p.Tags)
                    .Where(p =>
                        p.IsOpen == true && p.IsDelete == false &&
                        (!command.IsAI) ? p.IsAI == false : true &&
                        (!command.IsR18) ? p.IsR18 == false : true &&
                        p.PostTime <= today &&
                        (workList.Count > 0) ?
                            keywordList.All(w => p.Tags.All(t => t.Content.Equals(w))) : true)
                    .Union(
                        _context.Artwork
                        .AsNoTracking()
                        .Include(p => p.Tags)
                        .Where(p =>
                            p.IsOpen == true && p.IsDelete == false &&
                            (!command.IsAI) ? p.IsAI == false : true &&
                            (!command.IsR18) ? p.IsR18 == false : true &&
                            p.PostTime <= today &&
                            (workList.Count > 0) ?
                            keywordList.All(w => p.Title.Contains(w)) : true))
                    .Include(p => p.Artist)
                    .Include(p => p.Images);

                switch (command.OrderType.Trim().ToLower())
                {
                    case "posttime_desc":
                        list.OrderBy(p => p.PostTime);
                        break;
                    case "posttime":
                        list.OrderByDescending(p => p.PostTime);
                        break;
                    case "hit_desc":
                        list.OrderBy(p => p.LikeCounts);
                        break;
                    case "hit":
                        list.OrderByDescending(p => p.LikeCounts);
                        break;
                    default:
                        list.OrderByDescending(p => p.PostTime);
                        break;
                }

                list.Skip(command.Page * command.Count)
                    .Take(command.Count)
                    .ToList();

                foreach (var item in list)
                {
                    workList.Add(new ArtworkViewModel
                    {
                        Id = item.Id,
                        ArtistId = item.ArtistId,
                        Title = item.Title,
                        IsR18 = item.IsR18,
                        IsAI = item.IsAI,
                        ArtistName = item.Artist.Nickname,
                        ArtistHeadshotContent =
                            (string.IsNullOrEmpty(item.Artist.HeadshotContent)) ?
                            string.Empty : item.Artist.HeadshotContent,
                        CoverImg = item.Images[0].ArtworkContent
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetWorkList", ex);
            }

            return workList;
        }
    }
}
