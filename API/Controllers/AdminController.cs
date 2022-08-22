using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class AdminController : BaseApiController<AdminController>
{
    private readonly UserManager<AppUser> userManager;

    public AdminController(UserManager<AppUser> userManager)
    {
        this.userManager = userManager;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
        .Include(r => r.UserRoles)
        .ThenInclude(r => r.Role)
        .OrderBy(u => u.UserName)
        .Select(u => new
        {
            u.Id,
            Username = u.UserName,
            Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
        })
        .ToListAsync();

        return Ok(users);
    }

    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
    {
        var selectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByNameAsync(username);

        if (user == null) return NotFound("Could not find user");

        var userRoles = await userManager.GetRolesAsync(user);

        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

        if (!result.Succeeded)
        {
            return BadRequest("Failed to add to roles");
        }

        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

        if (!result.Succeeded) return BadRequest("Failed to remove from roles");

        return Ok(await userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhtosForModeration()
    {
        return Ok("Only admins or moderators can see this.");
    }

}