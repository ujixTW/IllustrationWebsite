using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;

namespace Illus.Server.Sservices.Account
{
    public class FollowService
    {
        private readonly IllusContext _context;
        private readonly int _userCount;
        public FollowService(IllusContext context)
        {
            _context = context;
            _userCount = 24;
        }
        public UserViewModel GetUser(int id, int userId)
        {
            var result = new UserViewModel();
            try
            {
                var user = _context.User
                    .AsNoTracking()
                    .Include(p => p.Language)
                    .Include(p => p.Country)
                    .Where(p => p.Id == id && p.IsActivation == true)
                    .FirstOrDefault();

                var followerCount = _context.Follow.AsNoTracking().Where(p => p.FollowingId == id).Count();
                var followingCount = _context.Follow.AsNoTracking().Where(p => p.FollowerId == id).Count();
                if (user != null)
                {
                    result = new UserViewModel
                    {
                        Id = id,
                        NickName = user.Nickname,
                        Profile = user.Profile,
                        CoverContent = user.CoverContent,
                        HeadshotContent = user.HeadshotContent,
                        Language = user.Language,
                        Country = user.Country,
                        FollowerCount = followerCount,
                        FollowingCount = followingCount,
                    };
                    if (id != userId)
                    {
                        var isFollow = _context.Follow
                            .AsNoTracking()
                            .Where(p => p.FollowerId == userId && p.FollowingId == id)
                            .FirstOrDefault();
                        result.IsFollow = (isFollow != null) ? true : false;
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetUser", ex);
            }
            return result;
        }
        public bool Follow(int id, int userId)
        {
            var result = false;
            try
            {
                var userCount = _context.User.Where(p => p.Id == id && p.IsActivation == true)
                    .Union(_context.User.Where(p => p.Id == userId && p.IsActivation == true)).Count();

                if (userCount.Equals(2))
                {
                    var follow = _context.Follow
                    .Where(p => p.FollowerId == userId && p.FollowingId == id)
                    .SingleOrDefault();

                    if (follow != null)
                    {
                        _context.Follow.Remove(follow);
                    }
                    else
                    {
                        _context.Follow.Add(new FollowModel
                        {
                            FollowerId = userId,
                            FollowingId = id,
                            FollowTime = DateTime.Now,
                        });
                    }
                    _context.SaveChanges();
                    result = true;
                }

            }
            catch (Exception ex)
            {
                Logger.WriteLog("Follow", ex);
            }
            return result;
        }
        public async Task<FollowViewListModel> GetFollowingList(int id, int page)
        {
            var result = new FollowViewListModel();
            try
            {
                var followingList = await _context.Follow
                    .AsNoTracking()
                    .Include(p => p.Following)
                    .ThenInclude(p =>
                        p.Artwork
                        .Where(a => a.IsOpen == true)
                        .OrderByDescending(a => a.PostTime)
                        .Take(4)
                        .ToList()
                        )
                    .ThenInclude(p => p.Likes.Where(l => l.UserId == id && l.Status == true).FirstOrDefault())
                    .Where(p => p.FollowerId == id)
                    .OrderByDescending(p => p.FollowTime)
                    .Skip(page * _userCount)
                    .Take(_userCount)
                    .ToListAsync();

                var count = _context.Follow.AsNoTracking().Where(p => p.FollowerId == id).Count();

                if (count > 0)
                {
                    foreach (var f in followingList)
                    {
                        var following = f.Following;
                        var workCoverList = new ArtworkViewListModel();
                        foreach (var work in following.Artwork)
                        {
                            workCoverList.ArtworkList.Add(new ArtworkViewModel
                            {
                                Id = work.Id,
                                CoverImg = work.CoverImg,
                                IsLike = work.Likes.Any(),
                            });
                        }
                        result.Users.Add(new UserViewModel
                        {
                            Id = following.Id,
                            NickName = following.Nickname,
                            Profile = following.Profile,
                            CoverContent = following.CoverContent,
                            ArtworkList = workCoverList
                        });
                    }

                    result.Count = count;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetFollowingList", ex);
            }
            return result;
        }
        public FollowViewListModel GetFollowerList(int id, int page)
        {
            var result = new FollowViewListModel();
            try
            {
                var folllowerList = _context.Follow
                    .AsNoTracking()
                    .Include(p => p.Follower)
                    .Where(p => p.FollowingId == id)
                    .OrderByDescending(p => p.FollowTime)
                    .ThenBy(p => p.FollowerId)
                    .Skip(page * _userCount)
                    .Take(_userCount)
                    .ToList();

                var count = _context.Follow.AsNoTracking().Where(p => p.FollowingId == id).Count();
                if (count > 0)
                {
                    foreach (var f in folllowerList)
                    {
                        result.Users.Add(new UserViewModel
                        {
                            Id = f.Follower.Id,
                            NickName = f.Follower.Nickname,
                            CoverContent = f.Follower.CoverContent,
                        });
                    }
                    result.Count = count;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("GetFollowingList", ex);
            }
            return result;
        }
    }
}
