using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Models
{
    [Table("MissionThemes")] 
    public class MissionTheme
    {
        public MissionTheme()
        {
            // Set default values
            IsDeleted = false;
            CreatedDate = DateTime.UtcNow;
            ModifiedDate = DateTime.UtcNow;
        }

        [Key]
        public long Id { get; set; }

        [Required]
        public string ThemeName { get; set; }

        [Required]
        public string Status { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool IsDeleted { get; set; }
    }
}
