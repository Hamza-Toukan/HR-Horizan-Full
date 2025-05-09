using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;


[Route("api/[controller]")]
[ApiController]
public class LeaveRequestController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    // private readonly UserManager<ApplicationUser> _userManager;

    public LeaveRequestController(ApplicationDbContext context)
    // , UserManager<ApplicationUser> userManager)
    {
        _context = context;
        // _userManager = userManager;
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> CreateLeave([FromBody] LeaveRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        request.EmployeeId = userId;
        request.Status = "Pending";

        _context.LeaveRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Leave request submitted successfully" });
    }

    [HttpGet("my-requests")]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var requests = await _context.LeaveRequests
            .Where(r => r.EmployeeId == userId)
            .OrderByDescending(r => r.StartDate)
            .ToListAsync();

        return Ok(requests);
    }
}
