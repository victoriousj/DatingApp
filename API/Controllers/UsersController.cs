using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UsersController : BaseApiController<UsersController>
    {
        private IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUserName = user.UserName;

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender.Equals("male") ? "female" : "male";
            }

            var users = await _userRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }

        [Authorize]
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto member)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            _mapper.Map(member, user);

            _userRepository.UpdateProfile(user);

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error is not null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo()
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem Adding Photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain)
            {
                return BadRequest("This is already your main photo");
            }

            var mainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
            if (mainPhoto is not null)
            {
                mainPhoto.IsMain = false;
            }

            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-member")]
        public async Task<ActionResult> DeleteMember()
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            foreach (var photo in user.Photos)
            {
                if (photo is not null && photo.PublicId is not null)
                {
                    await _photoService.DeletePhotoAsync(photo.PublicId);
                }
            }

            _userRepository.DeleteMember(user);
            if (await _userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Failed to delete user");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo is null)
            {
                return NotFound();
            }

            if (photo.IsMain)
            {
                return BadRequest("You can't delete your main photo");
            }

            if (photo.PublicId is not null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error is not null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);

            if (await _userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Failed to delete photo");
        }
    }
}