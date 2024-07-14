using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TodoApi.Models
{
    [Table("MissionSkills")] 
    public class MissionSkill
    {
        public MissionSkill()
        {

            IsDeleted = false;
            CreatedDate = DateTime.UtcNow;
            ModifiedDate = DateTime.UtcNow;
        }

        [Key]
        public long Id { get; set; }
        
        [Required]
        public string SkillName { get; set; }
        
        [Required]
        public string Status { get; set; }
        
        public DateTime? CreatedDate { get; set; }
        
        public DateTime? ModifiedDate { get; set; }
        
        public bool IsDeleted { get; set; }
    }
}
