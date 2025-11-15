using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AttenDancer.Entity.Dtos.User
{
    public class UserChangePassword
    {

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string OldPassword { get; set; } = null!;


        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = null!;


    }
}
