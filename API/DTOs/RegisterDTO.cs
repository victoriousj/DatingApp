using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
  public class RegisterDTO
  {
    [Required]
    public string Username { get; set; }

    [Required]
    [MinLength(4)]
    public string Password { get; set; }
  }
}