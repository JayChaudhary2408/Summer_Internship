using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<MissionSkill> MissionSkills { get; set; }
        public DbSet<MissionTheme> MissionThemes { get; set; }
        public DbSet<Mission> Missions { get; set; }
    }
}
