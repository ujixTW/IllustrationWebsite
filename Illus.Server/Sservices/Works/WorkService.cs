using Azure;
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
        #region 取得作品資訊
        public ArtworkViewListModel GetWorkList(WorkListCommand command)
        {
            var keywordList = new List<string>();

            if (!string.IsNullOrEmpty(command.Keywords))
                keywordList = command.Keywords.Trim().Split(' ').ToList();

            var workList = new List<ArtworkViewModel>();
            var maxCount = 0;
            try
            {
                var list = _context.Artwork
                    .Include(p => p.Tags)
                    .Where(p =>
                        p.IsOpen == true &&
                        (!command.IsAI) ? p.IsAI == false : true &&
                        (!command.IsR18) ? p.IsR18 == false : true &&
                        keywordList.Any() ?
                            keywordList.Any(w => p.Tags.Any(t => t.Content.Equals(w))) : true)
                    .Union(
                        _context.Artwork
                        .Include(p => p.Tags)
                        .Where(p =>
                            p.IsOpen == true &&
                            (!command.IsAI) ? p.IsAI == false : true &&
                            (!command.IsR18) ? p.IsR18 == false : true &&
                            keywordList.Any() ?
                                keywordList.Any(w => p.Title.Contains(w)) : true))
                    .Include(p => p.Artist)
                    .AsNoTracking();

                switch (command.OrderType)
                {
                    case (int)WorkListOrder.PostTime:
                        if (!command.IsDesc)
                            list.OrderByDescending(p => p.PostTime)
                                .ThenByDescending(p => p.Id);
                        else
                            list.OrderBy(p => p.PostTime)
                                .ThenByDescending(p => p.Id);
                        break;
                    case (int)WorkListOrder.Hot:
                        var hotConsts = _context.Artwork.Select(p => new
                        {
                            C = _context.Artwork.Average(p => p.ReadCounts),
                            scoreAvg = _context.Artwork.Average(p => p.LikeCounts / p.ReadCounts)
                        }).SingleOrDefault();

                        if (!command.IsDesc)
                            list.OrderByDescending(p =>
                                (hotConsts == null) ? 0 :
                                (hotConsts.C * hotConsts.scoreAvg + p.LikeCounts / p.ReadCounts) / (hotConsts.C + p.ReadCounts))
                                .ThenByDescending(p => p.Id);
                        else
                            list.OrderBy(p =>
                                (hotConsts == null) ? 0 :
                                (hotConsts.C * hotConsts.scoreAvg + p.LikeCounts / p.ReadCounts) / (hotConsts.C + p.ReadCounts))
                                .ThenByDescending(p => p.Id);
                        break;
                    default:
                        list.OrderByDescending(p => p.PostTime)
                            .ThenByDescending(p => p.Id);
                        break;
                }

                maxCount = list.Count();

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
                        CoverImg = item.CoverImg
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetWorkList", ex);
            }
            var temp = new ArtworkViewListModel { ArtworkList = workList, MaxCount = maxCount };

            return temp;
        }
        public ArtworkViewListModel GetDailyWorkList(bool isR18, bool isAi, int workCount)
        {
            var workList = new ArtworkViewListModel();
            var todayTheme = _context.DailyTheme.AsNoTracking()
                .Include(p => p.Tag.Content).SingleOrDefault(p => p.IsEnable == true);
            if (todayTheme != null)
            {
                workList = GetWorkList(new WorkListCommand
                {
                    Page = 0,
                    Count = workCount,
                    IsR18 = isR18,
                    IsAI = isAi,
                    Keywords = todayTheme.Tag.Content,
                    OrderType = (int)WorkListOrder.Hot
                });
            }
            return workList;
        }
        public ArtworkViewListModel GetArtistWorkList(WorkListCommand command, int id, bool isOwn)
        {
            var workList = new List<ArtworkViewModel>();
            var maxCount = 0;
            try
            {
                var list = _context.Artwork
                    .Where(p => p.ArtistId == id && (isOwn) ? p.IsDelete == false : p.IsOpen == true)
                    .AsNoTracking();

                switch (command.OrderType)
                {
                    case (int)WorkListOrder.PostTime:
                        if (command.IsDesc)
                            list.OrderBy(p => p.PostTime).ThenByDescending(p => p.Id);
                        else
                            list.OrderByDescending(p => p.PostTime).ThenByDescending(p => p.Id);
                        break;
                    case (int)WorkListOrder.Hot:
                        if (command.IsDesc)
                            list.OrderBy(p => p.LikeCounts).ThenByDescending(p => p.Id);
                        else
                            list.OrderByDescending(p => p.LikeCounts).ThenByDescending(p => p.Id);
                        break;
                    default:
                        list.OrderByDescending(p => p.PostTime).ThenByDescending(p => p.Id);
                        break;
                }

                maxCount = list.Count();

                list.Skip(command.Page * command.Count)
                    .Take(command.Count)
                    .ToList();

                foreach (var work in list)
                {
                    workList.Add(new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = work.ArtistId,
                        Title = work.Title,
                        CoverImg = work.CoverImg,
                        LikeCounts = work.LikeCounts,
                        ReadCounts = work.ReadCounts,
                        PostTime = work.PostTime,
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetArtistWorkList", ex);
            }

            var temp = new ArtworkViewListModel { ArtworkList = workList, MaxCount = maxCount };

            return temp;
        }
        public ArtworkViewModel GetWorkDetail(int id, int? userId, out bool success)
        {
            var model = new ArtworkViewModel();
            success = false;
            try
            {
                var today = DateTime.Now;
                var work = _context.Artwork
                    .Include(p => p.Images)
                    .Include(p => p.Artist)
                    .Include(p => p.Tags)
                    .SingleOrDefault(
                        p => p.Id == id &&
                        (p.ArtistId == userId) ? p.IsDelete == false : p.IsOpen == true &&
                        p.PostTime <= today);
                var history = _context.History.Where(p => p.ArtworkId == id).ToList();

                if (work != null)
                {
                    #region 紀錄閱讀紀錄
                    if (userId != null)
                    {
                        var hasData = false;
                        foreach (var h in history)
                        {
                            if (h.UserId == userId)
                            {
                                h.BrowseTime = today;
                                hasData = true;
                                break;
                            }
                        }

                        if (!hasData)
                        {
                            history.Add(new HistoryModel
                            {
                                ArtworkId = id,
                                UserId = userId,
                                BrowseTime = today
                            });
                        }
                    }
                    else
                    {
                        history.Add(new HistoryModel { ArtworkId = id, BrowseTime = today });
                    }

                    work.ReadCounts = history.Count;

                    #endregion

                    model = new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = work.ArtistId,
                        Title = work.Title,
                        Description = work.Description,
                        LikeCounts = work.LikeCounts,
                        ReadCounts = work.ReadCounts,
                        IsR18 = work.IsR18,
                        IsAI = work.IsAI,
                        PostTime = work.PostTime,
                        ArtistName = work.Artist.Nickname,
                        ArtistHeadshotContent = (string.IsNullOrEmpty(work.Artist.HeadshotContent)) ? string.Empty : work.Artist.HeadshotContent,
                        Tags = work.Tags,
                        Imgs = work.Images
                    };

                    _context.SaveChanges();
                    success = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetWorkDetail", ex);
            }
            return model;
        }
        #endregion
        #region 編輯作品
        public async Task<bool> AddWork(EditWorkCommand command, int userId)
        {
            var success = false;
            try
            {
                var today = DateTime.Now;
                #region 創建新作品至資料庫

                var newWork = new ArtworkModel
                {
                    ArtistId = userId,
                    Title = command.Title,
                    Description = command.Description,
                    IsR18 = command.IsR18,
                    IsAI = command.IsAI,
                    PostTime = (command.PostTime >= today) ? command.PostTime : today,
                    IsOpen = command.IsOpen,
                    Tags = _checkTagExisting(command.Tags),
                };

                _context.Artwork.Add(newWork);
                _context.SaveChanges();

                #endregion
                #region 將作品圖片存入伺服器
                var workId = newWork.Id;
                var workPaths = await FileHelper.SaveImageAsync(command.Imgs, workId, (int)FileHelper.imgType.Work);
                var coverPath = await FileHelper.SaveImageAsync(command.Cover, workId, (int)FileHelper.imgType.WorkCover);
                #endregion
                #region 將路徑資料寫入資料庫

                newWork.CoverImg = coverPath;
                newWork.Images = new List<ImgModel>();
                foreach (var path in workPaths)
                {
                    newWork.Images.Add(new ImgModel { ArtworkContent = path });
                }
                _context.SaveChanges();

                #endregion

                success = true;
            }
            catch (Exception ex)
            {
                Logger.WriteLog("AddWork", ex);
            }
            return success;
        }
        public bool DeleteWork(int workId, int userId)
        {
            var success = false;
            try
            {
                var work = _context.Artwork
                    .Where(p => p.Id == workId && p.ArtistId == userId)
                    .SingleOrDefault();
                if (work != null)
                {
                    work.IsDelete = true;
                    _context.SaveChanges();
                    success = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("DeleteWork", ex);
            }
            return success;
        }
        public async Task<bool> EditWork(EditWorkCommand command, int userId)
        {
            var success = false;
            try
            {
                var today = DateTime.Now;
                var work = _context.Artwork
                    .Include(p => p.Images)
                    .SingleOrDefault(p => p.Id == command.Id && p.ArtistId == userId);
                if (work != null)
                {
                    work.Title = command.Title;
                    work.CoverImg = await FileHelper.SaveImageAsync(command.Cover, command.Id, (int)FileHelper.imgType.WorkCover);
                    work.Description = command.Description;
                    work.IsR18 = command.IsR18;
                    work.IsAI = command.IsAI;
                    if (work.PostTime != command.PostTime)
                    {
                        work.PostTime = (command.PostTime >= today.AddSeconds(-10)) ?
                            command.PostTime : work.PostTime;
                    }
                    work.IsOpen = (work.PostTime > today) ? false : command.IsOpen;

                    var oldImgs = work.Images;
                    var newImgs = command.Imgs;
                    var paths = await FileHelper.SaveImageAsync(newImgs, command.Id, (int)FileHelper.imgType.Work);
                    if (oldImgs.Count > newImgs.Count)
                    {
                        var range = oldImgs.Count - newImgs.Count;
                        var oldPathList = new List<string>();

                        foreach (var img in oldImgs.GetRange(newImgs.Count, range))
                        {
                            oldPathList.Add(img.ArtworkContent);
                        }

                        FileHelper.DeleteImageAsync(oldPathList);
                        oldImgs.RemoveRange(newImgs.Count, range);
                    }
                    if (oldImgs.Count < newImgs.Count)
                    {
                        for (var i = 0; i < newImgs.Count; ++i)
                        {
                            if (i >= oldImgs.Count)
                            {
                                oldImgs.Add(new ImgModel { ArtworkContent = paths[i] });
                            }
                        }
                    }

                    _context.SaveChanges();
                    success = true;

                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditWork", ex);
            }

            return success;
        }
        #endregion
        #region 標籤讀取與編輯
        public List<TagModel> GetUserHistoryTag(int userId)
        {
            var tagList = new List<TagModel>();
            try
            {
                var userTagList = _context.Tag
                    .Include(p => p.Artworks)
                    .Where(p => p.Artworks.Any() ? p.Artworks.Any(a => a.ArtistId == userId) : false)
                    .OrderByDescending(p => p.Artworks.Where(a => a.ArtistId == userId).Count())
                    .ThenByDescending(p => p.Id)
                    .AsNoTracking()
                    .ToList();
                foreach (var tag in userTagList)
                {
                    tagList.Add(new TagModel { Id = tag.Id, Content = tag.Content });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetUserHistoryTag", ex);
            }
            return tagList;
        }
        public List<TagModel> GetTagRecommand(string input)
        {
            var tagList = new List<TagModel>();
            try
            {
                tagList = _context.Tag
                    .Where(p => p.Content.Contains(input))
                    .AsNoTracking()
                    .ToList();
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetTagRecommand", ex);
            }
            return tagList;
        }
        public void EditTag(EditTagCommand command, int workId, int userId)
        {
            try
            {
                var work = _context.Artwork.Include(p => p.Tags).FirstOrDefault(p => p.Id == workId);
                if (work != null)
                {
                    command.Content = command.Content.Trim();
                    if (work.ArtistId != userId)
                    {
                        if (work.Tags.All(t => t.Id != command.Id) || work.Tags.All(t => t.Content != command.Content))
                        {
                            var tagList = _checkTagExisting(new List<EditTagCommand> { command });
                            work.Tags.Add(tagList[0]);
                        }
                    }
                    else
                    {
                        if (command.Id != null &&
                           (work.Tags.Any(t => t.Id == command.Id) || work.Tags.Any(t => t.Content == command.Content)))
                        {
                            work.Tags.Remove(new TagModel
                            {
                                Id = (int)command.Id,
                                Content = command.Content
                            });
                        }
                        else
                        {
                            var tagList = _checkTagExisting(new List<EditTagCommand> { command });
                            work.Tags.Add(tagList[0]);
                        }
                    }
                    _context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditTag", ex);
            }
        }
        #endregion
        private List<TagModel> _checkTagExisting(List<EditTagCommand> inputTags)
        {
            if (inputTags.Any())
            {
                var dbTags = _context.Tag
                .Where(p => inputTags.Any(t => p.Id == t.Id))
                .Union(_context.Tag.Where(p => inputTags.Any(t => p.Content == t.Content.Trim())))
                .ToList();

                foreach (var input in inputTags)
                {
                    if (StringHelper.HasHtml(input.Content)) continue;

                    if (dbTags.All(p => p.Id != input.Id) &&
                        dbTags.All(P => P.Content != input.Content))
                    {
                        dbTags.Add(new TagModel { Content = input.Content });
                    }
                }
                _context.SaveChanges();

                var tagList = new List<TagModel>();
                foreach (var input in inputTags)
                {
                    if (StringHelper.HasHtml(input.Content)) continue;

                    var hasTag = false;
                    foreach (var tag in tagList)
                    {
                        if (input.Id == tag.Id || input.Content.Trim() == tag.Content)
                        {
                            hasTag = true;
                            break;
                        }
                    }

                    if (!hasTag)
                    {
                        foreach (var tag in dbTags)
                        {
                            if (tag.Id == input.Id || tag.Content == input.Content.Trim())
                            {
                                tagList.Add(tag); break;
                            }
                        }
                    }
                }
                return tagList;

            }
            else
            {
                return new List<TagModel>();
            }

        }
    }
}
