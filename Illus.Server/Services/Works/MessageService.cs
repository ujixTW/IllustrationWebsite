﻿using Illus.Server.Domain;
using Illus.Server.Helper;
using Illus.Server.Models;
using Illus.Server.Models.Command;
using Illus.Server.Models.View;
using Microsoft.EntityFrameworkCore;
using System.Web;

namespace Illus.Server.Sservices.Works
{
    public class MessageService
    {
        private readonly IllusContext _context;
        public MessageService(IllusContext context)
        {
            _context = context;
        }
        public bool WriteCommand(MessageCommand command, int userId)
        {
            var result = false;
            try
            {
                var work = _context.Artwork
                    .AsNoTracking()
                    .Where(p => p.Id == command.Id && p.IsOpen == true)
                    .SingleOrDefault();

                if (work != null)
                {
                    _context.Massage.Add(new MassageModel
                    {
                        ArtworkId = command.Id,
                        UserId = userId,
                        content = HttpUtility.HtmlEncode(command.Message),
                        CreateTime = DateTime.Now,
                    });

                    _context.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("WriteCommand", ex);
            }
            return result;
        }
        public bool EditCommand(MessageCommand command, int userId)
        {
            var result = false;
            try
            {
                var message = _context.Massage
                    .Where(p => p.Id == command.Id && p.UserId == userId && p.IsDelete == false)
                    .FirstOrDefault();
                if (message != null)
                {
                    message.IsEdit = true;
                    message.CreateTime = DateTime.Now;
                    message.content = HttpUtility.HtmlEncode(command.Message);

                    _context.SaveChanges();

                    result = true;
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("EditCommand", ex);
            }
            return result;
        }
        public bool DeleteCommand(int id, int userId)
        {
            var result = false;
            try
            {
                var message = _context.Massage
                    .Where(p => p.Id == id && p.UserId == userId)
                    .FirstOrDefault();
                if (message != null) message.IsDelete = true;
                _context.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                Logger.WriteLog("DeleteCommand", ex);
            }
            return result;
        }
        public async Task<List<MessageViewModel>> GetCommandList(int workId, int page)
        {
            var result = new List<MessageViewModel>();
            try
            {
                var pageCount = 30;
                var messageList = await _context.Massage
                    .AsNoTracking()
                    .Include(p => p.User)
                    .Where(p => p.ArtworkId == workId && p.IsDelete == false)
                    .OrderByDescending(p => p.Id)
                    .Skip(page * pageCount)
                    .Take(pageCount)
                    .ToListAsync();

                foreach (var message in messageList)
                {
                    var user = message.User;
                    if (user != null)
                        result.Add(new MessageViewModel
                        {
                            Id = message.Id,
                            WorkId = workId,
                            UserId = message.UserId,
                            UserNickName = user.Nickname,
                            UserHeadshot = (user.HeadshotContent != null) ? user.HeadshotContent : string.Empty,
                            Message = message.content,
                            CreateTime = message.CreateTime,
                            IsEdit = message.IsEdit,
                        });
                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog("DeleteCommand", ex);
            }
            return result;
        }
    }
}