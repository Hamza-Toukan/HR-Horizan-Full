using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;
using System;

[Route("api/[controller]")]
[ApiController]
public class LeaveRequestController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LeaveRequestController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Authorize(Roles = "Employee")]
    public async Task<IActionResult> CreateLeave([FromBody] LeaveRequest request)
    {
        try
        {
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"🔐 Claim: {claim.Type} = {claim.Value}");
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                Console.WriteLine("Error: UserId not found in JWT");
                return Unauthorized("User is not authenticated.");
            }

            request.EmployeeId = userId;
            request.Status = LeaveStatus.Pending;

            Console.WriteLine($"Creating leave request for userId: {userId}, Status: {request.Status}");

            _context.LeaveRequests.Add(request);
            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                Console.WriteLine("Leave request submitted successfully.");
                return Ok(new { message = "Leave request submitted successfully" });
            }
            else
            {
                Console.WriteLine("Error: Failed to save leave request.");
                return StatusCode(500, "An error occurred while saving the leave request.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during leave request creation: {ex.Message}");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

[HttpGet("my-requests")]
[Authorize(Roles = "Employee")]
public async Task<IActionResult> GetMyRequests()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userId == null)
    {
        Console.WriteLine("Error: UserId not found in JWT");
        return Unauthorized("User is not authenticated.");
    }

    try
    {
        var requests = await _context.LeaveRequests
            .Where(r => r.EmployeeId == userId)
            .OrderByDescending(r => r.StartDate)
            .Select(r => new 
            {
                r.Id,
                r.Reason,
                r.StartDate,
                r.EndDate,
                r.EmployeeId // Include EmployeeId here
            })
            .ToListAsync();

        Console.WriteLine($"Fetched {requests.Count} leave requests for userId: {userId}");
        return Ok(requests);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during fetching leave requests: {ex.Message}");
        return StatusCode(500, "An unexpected error occurred.");
    }
}


    [HttpPut("update-status/{id}")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] string newStatus)
    {
        try
        {
            var request = await _context.LeaveRequests.FindAsync(id);
            if (request == null)
            {
                Console.WriteLine($"Error: Leave request with id {id} not found.");
                return NotFound("Leave request not found.");
            }

            if (!Enum.TryParse<LeaveStatus>(newStatus, true, out var parsedStatus))
            {
                Console.WriteLine($"Error: Invalid status value received: {newStatus}");
                return BadRequest("Invalid status value.");
            }

            request.Status = parsedStatus;
            await _context.SaveChangesAsync();

            Console.WriteLine($"Updated leave request {id} status to {parsedStatus}");
            return Ok(new { message = $"Leave request {id} status updated to {parsedStatus}" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during status update: {ex.Message}");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpGet("all")]
    [Authorize(Roles = "HR")]
    public async Task<IActionResult> GetAllRequests()
    {
        try
        {
            var requests = await _context.LeaveRequests
                .Include(r => r.Employee)
                .OrderByDescending(r => r.StartDate)
                .ToListAsync();

            Console.WriteLine($"Fetched {requests.Count} leave requests for HR.");
            return Ok(requests);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching all leave requests: {ex.Message}");
            return StatusCode(500, "An unexpected error occurred.");
        }
    }
}