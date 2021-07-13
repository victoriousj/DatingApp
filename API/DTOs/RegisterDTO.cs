using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
  public class RegisterDTO
  {
    [Required]
    public string Username { get; set; }

    [Required]
    [StringLength(9, MinimumLength = 4)]
    public string Password { get; set; }
  }
}