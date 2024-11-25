using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Web;

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
        public async Task<ArtworkViewListModel> GetWorkList(WorkListCommand command)
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
                        p.IsDelete == false &&
                        ((!command.IsAI) ? p.IsAI == false : true) &&
                        ((!command.IsR18) ? p.IsR18 == false : true) &&
                        (keywordList.Any() ?
                            keywordList.All(w => p.Tags.Any(t => t.Content.Equals(w)) || p.Title.Contains(w)) : true))
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

                        _getWorkHotCounts(out var C, out var scoreAvg);
                        var calHot = (int likeC, int readC) =>
                            (C * scoreAvg + likeC / readC) / (C + readC);

                        if (!command.IsDesc)
                            list.OrderByDescending(p => (C != 0 && scoreAvg != 0) ? calHot(p.LikeCounts, p.ReadCounts) : 0)
                                .ThenByDescending(p => p.Id);
                        else
                            list.OrderBy(p => (C != 0 && scoreAvg != 0) ? calHot(p.LikeCounts, p.ReadCounts) : 0)
                                .ThenByDescending(p => p.Id);
                        break;
                    default:
                        list.OrderByDescending(p => p.PostTime)
                            .ThenByDescending(p => p.Id);
                        break;
                }

                maxCount = list.Count();

                await list.Skip(command.Page * command.Count)
                    .Take(command.Count)
                    .ToListAsync();
                var likeList = await _context.Like
                    .AsNoTracking()
                    .Where(p => list.Any(a => a.Id == p.ArtworkId) && p.UserId == command.UserId)
                    .ToListAsync();

                foreach (var item in list)
                {
                    workList.Add(new ArtworkViewModel
                    {
                        Id = item.Id,
                        ArtistId = item.ArtistId,
                        Title = item.Title,
                        IsR18 = item.IsR18,
                        IsAI = item.IsAI,
                        IsLike = likeList.Any(p => p.ArtworkId == item.Id && p.Status == true),
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
        public async Task<ArtworkViewListModel> GetDailyWorkList(WorkListCommand command)
        {
            var workList = new ArtworkViewListModel();
            var todayTheme = _context.DailyTheme.AsNoTracking()
                .Include(p => p.Tag)
                .SingleOrDefault(p => p.SpecifyDay.Date == DateTime.Today.Date && p.IsEnable == true);

            if (todayTheme != null)
            {
                command.Keywords = todayTheme.Tag.Content;
                command.OrderType = (int)WorkListOrder.Hot;
                workList = await GetWorkList(command);
                workList.DailyTheme = todayTheme.Tag.Content;
            }
            return workList;
        }
        public async Task<ArtworkViewListModel> GetArtistWorkList(WorkListCommand command, List<int> idList, bool isOwn)
        {
            var workList = new List<ArtworkViewModel>();
            var maxCount = 0;
            try
            {
                var list = _context.Artwork
                    .AsNoTracking()
                    .Where(p =>
                        ((!command.IsR18) ? p.IsR18 == false : true) &&
                        p.IsDelete == false &&
                        ((isOwn) ? true : p.IsOpen == true) &&
                        idList.Any(id => id == p.ArtistId))
                    .Include(p => p.Artist);


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

                await list.Skip(command.Page * command.Count)
                    .Take(command.Count)
                    .ToListAsync();
                var likeList = await _context.Like
                   .AsNoTracking()
                   .Where(p => list.Any(a => a.Id == p.ArtworkId) && p.UserId == command.UserId)
                   .ToListAsync();

                foreach (var work in list)
                {
                    workList.Add(new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = work.ArtistId,
                        Title = work.Title,
                        CoverImg = work.CoverImg,
                        IsR18 = work.IsR18,
                        IsAI = work.IsAI,
                        LikeCounts = work.LikeCounts,
                        ReadCounts = work.ReadCounts,
                        PostTime = work.PostTime.ToString("u"),
                        IsLike = work.Likes.Any(),
                        ArtistName = work.Artist.Nickname,
                        ArtistHeadshotContent =
                            (string.IsNullOrEmpty(work.Artist.HeadshotContent)) ?
                            string.Empty : work.Artist.HeadshotContent,
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
        public async Task<ArtworkViewListModel> GetFollowingWorkList(WorkListCommand command)
        {
            var result = new ArtworkViewListModel();
            try
            {
                var list = await _context.Follow
                    .AsNoTracking()
                    .Where(p => p.FollowerId == command.UserId && p.Following.IsActivation == true)
                    .ToListAsync();

                if (list.Any())
                {
                    var followingList = new List<int>();
                    foreach (var item in list)
                    {
                        followingList.Add(item.FollowingId);
                    }
                    result = await GetArtistWorkList(command, followingList, false);
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetFollowingWorkList", ex);
            }
            return result;
        }
        public async Task<List<ArtworkViewModel>> GetBackgroundWorkList()
        {
            var result = new List<ArtworkViewModel>();
            try
            {
                _getWorkHotCounts(out var C, out var scoreAvg);

                var tempList = await _context.Artwork
                    .AsNoTracking()
                    .Include(p => p.Artist)
                    .Include(p => p.Images)
                    .Where(p =>
                        p.IsAI == false &&
                        p.IsR18 == false &&
                        p.IsDelete == false &&
                        p.IsOpen == true)
                    .OrderByDescending(p => (C != 0 && scoreAvg != 0) ?
                        (C * scoreAvg + p.LikeCounts / p.ReadCounts) / (C + p.ReadCounts) : 0)
                    .ThenByDescending(p => p.Id)
                    .Take(10)
                    .ToListAsync();

                if (tempList.Any())
                {
                    foreach (var item in tempList)
                    {
                        var artist = item.Artist;
                        result.Add(new ArtworkViewModel
                        {
                            Id = item.Id,
                            ArtistId = item.ArtistId,
                            Title = item.Title,
                            ArtistName = (!string.IsNullOrEmpty(artist.Nickname)) ? artist.Nickname : artist.Account,
                            ArtistHeadshotContent = (!string.IsNullOrEmpty(artist.HeadshotContent)) ? artist.HeadshotContent : string.Empty,
                            Imgs = new List<ImgModel> { item.Images[0] }
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetBackgroundWorkList", ex);
            }
            return result;
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
                    .Where(p => p.Id == id &&
                        ((userId != null && p.ArtistId == userId) ? p.IsDelete == false : p.IsOpen == true) &&
                        ((userId != null && p.ArtistId != userId) ? p.PostTime <= today : true))
                    .SingleOrDefault();
                var isLike = userId != null ?
                    _context.Like
                    .AsNoTracking()
                    .FirstOrDefault(p => p.ArtworkId == id && p.UserId == userId)
                    : null;

                if (work != null)
                {
                    #region 紀錄閱讀紀錄

                    var history = _context.History.Where(p => p.ArtworkId == id && p.UserId == userId).FirstOrDefault();
                    if (history != null)
                    {
                        history.BrowseTime = today;
                    }
                    else
                    {
                        var newHis = new HistoryModel
                        {
                            Artwork = work,
                            User = userId != null ? _context.User.FirstOrDefault(p => p.Id == userId) : null,
                            BrowseTime = today,
                        };
                        _context.History.Add(newHis);
                    }
                    work.ReadCounts = _context.History.Where(p => p.ArtworkId == id).Count();

                    #endregion

                    model = new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = work.ArtistId,
                        Title = work.Title,
                        CoverImg = work.CoverImg,
                        Description = work.Description,
                        LikeCounts = work.LikeCounts,
                        ReadCounts = work.ReadCounts,
                        IsR18 = work.IsR18,
                        IsAI = work.IsAI,
                        IsLike = isLike != null ? isLike.Status : false,
                        PostTime = work.PostTime.ToString("u"),
                        ArtistName = work.Artist.Nickname,
                        ArtistHeadshotContent = (string.IsNullOrWhiteSpace(work.Artist.HeadshotContent)) ? string.Empty : work.Artist.HeadshotContent,
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
        public ArtworkViewListModel GetArtworkHistoryList(WorkListCommand command)
        {
            var result = new ArtworkViewListModel();
            try
            {
                var hisList = _context.History
                    .AsNoTracking()
                    .Include(p => p.Artwork)
                        .ThenInclude(p => p.Artist)
                    .Where(p => p.UserId == command.UserId && p.Artwork.IsOpen == true && p.Artwork.IsDelete == false);
                var count = hisList.Count();

                if (command.IsDesc)
                {
                    hisList.OrderBy(p => p.BrowseTime);
                }
                else
                {
                    hisList.OrderByDescending(p => p.BrowseTime);
                }

                hisList.Skip(command.Count * command.Page).Take(command.Count).ToList();

                foreach (var history in hisList)
                {
                    var work = history.Artwork;
                    var artist = work.Artist;
                    result.ArtworkList.Add(new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = artist.Id,
                        Title = work.Title,
                        CoverImg = work.CoverImg,
                        PostTime = history.BrowseTime.ToString("u"),
                        ArtistName = artist.Nickname,
                        ArtistHeadshotContent = string.IsNullOrEmpty(artist.HeadshotContent) ? string.Empty : artist.HeadshotContent
                    });
                }
                result.MaxCount = count;

            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetArtworkHistoryList", ex);
            }
            return result;
        }
        public ArtworkViewListModel GetLikeArtWorkList(WorkListCommand command)
        {
            var result = new ArtworkViewListModel();
            try
            {
                var likeList = _context.Like
                    .AsNoTracking()
                    .Include(p => p.Artwork)
                    .ThenInclude(p => p.Artist)
                    .Where(p =>
                        p.UserId == command.UserId &&
                        p.Status == true &&
                        p.Artwork.IsOpen == true &&
                        p.Artwork.IsDelete == false
                        );

                var count = likeList.Count();

                likeList.OrderByDescending(p => p.UpdateTime)
                    .Skip(command.Count * command.Page)
                    .Take(command.Count)
                    .ToList();

                foreach (var like in likeList)
                {
                    var work = like.Artwork;
                    result.ArtworkList.Add(new ArtworkViewModel
                    {
                        Id = work.Id,
                        ArtistId = work.ArtistId,
                        CoverImg = work.CoverImg,
                        ArtistName = work.Artist.Nickname,
                        ArtistHeadshotContent = string.IsNullOrEmpty(work.Artist.HeadshotContent) ? string.Empty : work.Artist.HeadshotContent,
                    });
                }
                result.MaxCount = count;
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetLikeArtWorkList", ex);
            }
            return result;
        }
        #endregion
        #region 編輯作品
        public async Task<bool> AddWork(EditWorkCommand command, int userId)
        {
            var success = false;
            try
            {
                var today = DateTime.Now;


                var user = await _context.User.Where(p => p.Id == userId).SingleOrDefaultAsync();

                if (user != null)
                {
                    #region 創建新作品至資料庫
                    var tags = await _checkTagExisting(command.Tags);

                    var newWork = new ArtworkModel
                    {
                        ArtistId = userId,
                        Title = HttpUtility.HtmlEncode(command.Title),
                        Description = (string.IsNullOrWhiteSpace(command.Description)) ? "" : HttpUtility.HtmlEncode(command.Description),
                        IsR18 = command.IsR18,
                        IsAI = command.IsAI,
                        PostTime = (command.PostTime >= today) ? command.PostTime : today,
                        IsOpen = command.IsOpen,
                        Tags = tags,
                    };
                    user.Artwork.Add(newWork);
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
                    .Include(p => p.Images)
                    .Where(p => p.Id == workId && p.ArtistId == userId)
                    .SingleOrDefault();
                if (work != null)
                {
                    var imgPathList = new List<string>();

                    foreach (var img in work.Images)
                    {
                        imgPathList.Add(img.ArtworkContent);
                    }
                    if (work.CoverImg != null) imgPathList.Add(work.CoverImg);
                    FileHelper.DeleteImage(imgPathList);


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
                    work.Title = HttpUtility.HtmlEncode(command.Title);
                    work.CoverImg = await FileHelper.SaveImageAsync(command.Cover, command.Id, (int)FileHelper.imgType.WorkCover);
                    work.Description = (string.IsNullOrWhiteSpace(command.Description)) ? "" : HttpUtility.HtmlEncode(command.Description);
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

                        FileHelper.DeleteImage(oldPathList);
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
        public async Task<List<TagModel>> EditTag(EditTagCommand command, int workId, int userId)
        {
            var result = new List<TagModel>();
            try
            {
                var work = await _context.Artwork.Include(p => p.Tags).FirstOrDefaultAsync(p => p.Id == workId);
                if (work != null)
                {
                    command.Content = command.Content.Trim();
                    if (work.ArtistId != userId)
                    {
                        if (work.Tags.All(t => t.Id != command.Id) || work.Tags.All(t => t.Content != command.Content))
                        {
                            var tagList = await _checkTagExisting(new List<string> { command.Content });
                            work.Tags.Add(tagList[0]);
                        }
                    }
                    else
                    {
                        if (command.Id != null &&
                           (work.Tags.Any(t => t.Id == command.Id) || work.Tags.Any(t => t.Content == command.Content)))
                        {
                            var target = work.Tags.Find(p => p.Id == command.Id);
                            if (target != null) work.Tags.Remove(target);
                        }
                        else
                        {
                            var tagList = await _checkTagExisting(new List<string> { command.Content });
                            work.Tags.Add(tagList[0]);
                        }
                    }
                    _context.SaveChanges();

                    result = work.Tags;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditTag", ex);
            }
            return result;
        }
        #endregion
        public bool LikeWork(int workId, int userId, out int likeCount)
        {
            var result = false;
            likeCount = 0;
            try
            {
                var work = _context.Artwork
                    .Include(p => p.Likes)
                    .Where(p => p.Id == workId && p.IsOpen == true)
                    .SingleOrDefault();
                if (work != null)
                {
                    var like = work.Likes.Find(p => p.UserId == userId);

                    if (like != null)
                    {
                        like.Status = !like.Status;
                        like.UpdateTime = DateTime.Now;
                    }
                    else
                    {
                        work.Likes.Add(new LikeModel
                        {
                            UserId = userId,
                            Status = true,
                            CreateTime = DateTime.Now
                        });
                    }
                    work.LikeCounts = work.Likes.FindAll(p => p.Status == true).Count;
                    likeCount = work.LikeCounts;
                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("LikeWork", ex);
            }
            return result;
        }
        public async Task<List<UserViewModel>> GetLikeList(int workId)
        {
            var userList = new List<UserViewModel>();
            try
            {
                var likeList = await _context.Like
                    .AsNoTracking()
                    .Include(p => p.User)
                    .Where(p => p.ArtworkId == workId && p.Status == true)
                    .ToListAsync();
                foreach (var like in likeList)
                {
                    if (like.User != null)
                    {
                        userList.Add(new UserViewModel
                        {
                            Id = like.UserId,
                            NickName = like.User.Nickname,
                            Headshot = like.User.HeadshotContent,
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetLikeList", ex);
            }
            return userList;
        }
        public async Task<List<TagModel>> GetSearchRecommand(string searchText)
        {
            var result = new List<TagModel>();
            try
            {
                var tagList = await _context.Tag
                    .AsNoTracking()
                    .Where(p => p.Content
                    .Contains(searchText))
                    .Select(p => new { p.Id, p.Content, p.Artworks.Count })
                    .OrderByDescending(p => p.Count)
                    .ThenByDescending(p => p.Id)
                    .Take(10)
                    .ToListAsync();

                foreach (var tag in tagList)
                {
                    result.Add(new TagModel
                    {
                        Id = tag.Id,
                        Content = tag.Content,
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetSearchRecommand", ex);
            }
            return result;
        }

        private async Task<List<TagModel>> _checkTagExisting(List<string> inputTags)
        {
            if (inputTags.Any())
            {
                var dbTags = await _context.Tag
                .Where(p => inputTags.Any(t => p.Content == t.Trim()))
                .ToListAsync();

                foreach (var input in inputTags)
                {
                    var inputTrim = input.Trim();
                    if (StringHelper.HasHtml(inputTrim)) continue;

                    if (
                        dbTags.All(P => P.Content != inputTrim))
                    {
                        dbTags.Add(new TagModel { Content = inputTrim });
                    }
                }
                _context.SaveChanges();

                var tagList = new List<TagModel>();
                foreach (var input in inputTags)
                {
                    var inputTrim = input.Trim();

                    if (StringHelper.HasHtml(inputTrim)) continue;

                    var hasTag = false;
                    foreach (var tag in tagList)
                    {
                        if (inputTrim == tag.Content)
                        {
                            hasTag = true;
                            break;
                        }
                    }

                    if (!hasTag)
                    {
                        foreach (var tag in dbTags)
                        {
                            if (tag.Content == inputTrim)
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
        private void _getWorkHotCounts(out double C, out double scoreAvg)
        {
            C = 0;
            scoreAvg = 0;
            try
            {
                var temp =
                    _context.Artwork.Select(p => new
                    {
                        C = _context.Artwork
                             .Where(p => p.IsOpen == true && p.IsDelete == false)
                             .Average(p => p.ReadCounts),
                        scoreAvg = _context.Artwork
                             .Where(p => p.IsOpen == true && p.IsDelete == false)
                             .Average(p => p.LikeCounts / p.ReadCounts)
                    })
                    .FirstOrDefault();
                if (temp != null)
                {
                    C = temp.C;
                    scoreAvg = temp.scoreAvg;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("_getWorkHotCounts", ex);
            }
        }
    }
}
