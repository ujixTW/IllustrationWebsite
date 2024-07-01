﻿using Illus.Server.Domain;
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
                        (keywordList.Count > 0) ?
                            keywordList.All(w => p.Tags.All(t => t.Content.Equals(w))) : true)
                    .Union(
                        _context.Artwork
                        .Include(p => p.Tags)
                        .Where(p =>
                            p.IsOpen == true &&
                            (!command.IsAI) ? p.IsAI == false : true &&
                            (!command.IsR18) ? p.IsR18 == false : true &&
                            (keywordList.Count > 0) ?
                                keywordList.All(w => p.Title.Contains(w)) : true))
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
        public ArtworkViewModel? GetWorkDetail(int id, int? userId)
        {
            var model = new ArtworkViewModel();
            try
            {
                var today = DateTime.Now;
                var work = _context.Artwork
                    .Include(p => p.Images)
                    .Include(p => p.Artist)
                    .Include(p => p.Tags)
                    .SingleOrDefault(
                        p => p.Id == id && p.IsOpen == true &&
                        p.IsDelete == false && p.PostTime <= today);
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
                }
                else { model = null; }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetWorkDetail", ex);
            }
            return model;
        }
    }
}