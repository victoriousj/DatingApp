using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            if (users == null) return;

            var roles = new List<AppRole>()
            {
                new AppRole{ Name = "Member"},
                new AppRole{ Name = "Admin"},
                new AppRole{ Name = "Moderator"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }


            int index = 0;
            foreach (var user in users)
            {
                try
                {

                    using var hmac = new HMACSHA512();

                    user.UserName = user.UserName.ToLower();

                    user.Photos.Add(new Photo()
                    {
                        Url = $"https://randomuser.me/api/portraits/{(user.Gender == "male" ? "" : "wo")}men/{index++ % 99 + 1}.jpg",
                        IsMain = true
                    });

                    await userManager.CreateAsync(user, "password");
                    await userManager.AddToRoleAsync(user, "Member");
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Blue;
                    Console.WriteLine(ex.Message);
                }
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "password");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}