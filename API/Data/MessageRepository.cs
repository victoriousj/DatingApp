using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Interfaces.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper _mapper)
        {
            this._context = context;
            this._mapper = _mapper;
        }

        public void AddGroup(Group group)
        {
            _context.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(x => x.Connections)
                .FirstOrDefaultAsync(x => x.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(x => x.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.RecipientUsername == messageParams.Username
                    && x.RecipientDeleted == false),
                "Outbox" => query.Where(x => x.SenderUsername == messageParams.Username
                    && x.SenderDeleted == false),
                _ => query.Where(x => x.RecipientUsername == messageParams.Username
                    && x.RecipientDeleted == false
                    && x.DateRead == null),
            };

            return await PagedList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesThread(string currentUsername, string recipientUsername)
        {
            var messages = await _context.Messages
                .Where(x =>
                    (x.RecipientUsername == currentUsername
                        && x.SenderUsername == recipientUsername)
                        && x.RecipientDeleted == false
                    || (x.RecipientUsername == recipientUsername
                        && x.SenderUsername == currentUsername)
                        && x.SenderDeleted == false)
                .OrderBy(x => x.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            var unreadMessages = messages
                .Where(x => x.DateRead is null && x.RecipientUsername == currentUsername)
                .ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }

            return messages;
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public async Task RemoveAllConnections()
        {
            var all = from connections in _context.Connections select connections;

            _context.Connections.RemoveRange(all);

            await _context.SaveChangesAsync();
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context
                .Groups
                .Include(x => x.Connections)
                .Where(x => x.Connections
                    .Any(y => y.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }
    }
}
