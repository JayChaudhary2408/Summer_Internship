using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MissionController : ControllerBase
    {
        private readonly TodoContext _context;

        public MissionController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/Mission
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mission>>> GetMissions()
        {
            return await _context.Missions.Where(m => !m.IsDeleted).ToListAsync();
        }

        // GET: api/Mission/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Mission>> GetMission(int id)
        {
            var mission = await _context.Missions.FindAsync(id);

            if (mission == null || mission.IsDeleted)
            {
                return NotFound();
            }

            return mission;
        }

        // POST: api/Mission
        [HttpPost]
        public async Task<ActionResult<Mission>> CreateMission(Mission mission)
        {
            mission.IsDeleted = false;
            mission.CreatedDate = DateTime.Now;
            _context.Missions.Add(mission);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMission), new { id = mission.Id }, mission);
        }

        // PUT: api/Mission/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMission(int id, Mission mission)
        {
            if (id != mission.Id)
            {
                return BadRequest();
            }

            var existingMission = await _context.Missions.FindAsync(id);
            if (existingMission == null || existingMission.IsDeleted)
            {
                return NotFound();
            }

            existingMission.MissionTitle = mission.MissionTitle;
            existingMission.MissionDescription = mission.MissionDescription;
            existingMission.MissionOrganisationName = mission.MissionOrganisationName;
            existingMission.MissionOrganisationDetail = mission.MissionOrganisationDetail;
            existingMission.CountryId = mission.CountryId;
            existingMission.CityId = mission.CityId;
            existingMission.StartDate = mission.StartDate;
            existingMission.EndDate = mission.EndDate;
            existingMission.MissionType = mission.MissionType;
            existingMission.TotalSheets = mission.TotalSheets;
            existingMission.RegistrationDeadLine = mission.RegistrationDeadLine;
            existingMission.MissionThemeId = mission.MissionThemeId;
            existingMission.MissionSkillId = mission.MissionSkillId;
            existingMission.MissionImages = mission.MissionImages;
            existingMission.MissionDocuments = mission.MissionDocuments;
            existingMission.MissionAvilability = mission.MissionAvilability;
            existingMission.MissionVideoUrl = mission.MissionVideoUrl;
            existingMission.ModifiedDate = DateTime.Now;

            _context.Entry(existingMission).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MissionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Mission/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMission(int id)
        {
            var mission = await _context.Missions.FindAsync(id);
            if (mission == null || mission.IsDeleted)
            {
                return NotFound();
            }

            mission.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MissionExists(int id)
        {
            return _context.Missions.Any(e => e.Id == id && !e.IsDeleted);
        }
    }
}
