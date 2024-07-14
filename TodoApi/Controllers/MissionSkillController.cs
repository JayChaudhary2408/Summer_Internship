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
    public class MissionSkillsController : ControllerBase
    {
        private readonly TodoContext _context;

        public MissionSkillsController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/MissionSkills
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MissionSkill>>> GetMissionSkills()
        {
            // Only retrieve entries where IsDeleted is false
            return await _context.MissionSkills.Where(ms => !ms.IsDeleted).ToListAsync();
        }

        // GET: api/MissionSkills/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MissionSkill>> GetMissionSkill(long id)
        {
            var missionSkill = await _context.MissionSkills.FindAsync(id);

            if (missionSkill == null || missionSkill.IsDeleted)
            {
                return NotFound();
            }

            return missionSkill;
        }

        // POST: api/MissionSkills
        [HttpPost]
public async Task<ActionResult<MissionSkill>> CreateMissionSkill(MissionSkill missionSkill)
{
    // Set Id to max Id + 1
    missionSkill.Id = _context.MissionSkills.Any() ? _context.MissionSkills.Max(ms => ms.Id) + 1 : 1;
    missionSkill.CreatedDate = DateTime.UtcNow;
    missionSkill.ModifiedDate = DateTime.UtcNow;
    missionSkill.IsDeleted = false; // Ensure IsDeleted is false

    _context.MissionSkills.Add(missionSkill);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetMissionSkill), new { id = missionSkill.Id }, missionSkill);
}

        // PUT: api/MissionSkills/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMissionSkill(long id, MissionSkill missionSkill)
        {
            if (id != missionSkill.Id || missionSkill.IsDeleted)
            {
                return BadRequest();
            }

            var existingMissionSkill = await _context.MissionSkills.FindAsync(id);
            if (existingMissionSkill == null || existingMissionSkill.IsDeleted)
            {
                return NotFound();
            }

            missionSkill.ModifiedDate = DateTime.UtcNow;
            _context.Entry(existingMissionSkill).CurrentValues.SetValues(missionSkill);
            _context.Entry(existingMissionSkill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MissionSkillExists(id))
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

        // DELETE: api/MissionSkills/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMissionSkill(long id)
        {
            var missionSkill = await _context.MissionSkills.FindAsync(id);
            if (missionSkill == null)
            {
                return NotFound();
            }

            missionSkill.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MissionSkillExists(long id)
        {
            return _context.MissionSkills.Any(e => e.Id == id && !e.IsDeleted);
        }
    }
}
