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
    public class MissionThemesController : ControllerBase
    {
        private readonly TodoContext _context;

        public MissionThemesController(TodoContext context)
        {
            _context = context;
        }

        // GET: api/MissionThemes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MissionTheme>>> GetMissionThemes()
        {
            // Only retrieve entries where IsDeleted is false
            return await _context.MissionThemes.Where(mt => !mt.IsDeleted).ToListAsync();
        }

        // GET: api/MissionThemes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MissionTheme>> GetMissionTheme(long id)
        {
            var missionTheme = await _context.MissionThemes.FindAsync(id);

            if (missionTheme == null || missionTheme.IsDeleted)
            {
                return NotFound();
            }

            return missionTheme;
        }

        // POST: api/MissionThemes
        [HttpPost]
        public async Task<ActionResult<MissionTheme>> CreateMissionTheme(MissionTheme missionTheme)
        {
            // Set Id to max Id + 1
            missionTheme.Id = _context.MissionThemes.Any() ? _context.MissionThemes.Max(mt => mt.Id) + 1 : 1;
            missionTheme.CreatedDate = DateTime.UtcNow;
            missionTheme.ModifiedDate = DateTime.UtcNow;
            missionTheme.IsDeleted = false; // Ensure IsDeleted is false

            _context.MissionThemes.Add(missionTheme);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMissionTheme), new { id = missionTheme.Id }, missionTheme);
        }

        // PUT: api/MissionThemes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMissionTheme(long id, MissionTheme missionTheme)
        {
            if (id != missionTheme.Id || missionTheme.IsDeleted)
            {
                return BadRequest();
            }

            var existingMissionTheme = await _context.MissionThemes.FindAsync(id);
            if (existingMissionTheme == null || existingMissionTheme.IsDeleted)
            {
                return NotFound();
            }

            missionTheme.ModifiedDate = DateTime.UtcNow;
            _context.Entry(existingMissionTheme).CurrentValues.SetValues(missionTheme);
            _context.Entry(existingMissionTheme).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MissionThemeExists(id))
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

        // DELETE: api/MissionThemes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMissionTheme(long id)
        {
            var missionTheme = await _context.MissionThemes.FindAsync(id);
            if (missionTheme == null)
            {
                return NotFound();
            }

            missionTheme.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MissionThemeExists(long id)
        {
            return _context.MissionThemes.Any(e => e.Id == id && !e.IsDeleted);
        }
    }
}
