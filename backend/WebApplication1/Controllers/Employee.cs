using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.DTOs;
using WebApplication1.Models;
using WebApplication1.Data;

[Route("api/employee")]
[ApiController]
public class EmployeeController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EmployeeController> _logger;


    public EmployeeController(ILogger<EmployeeController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    //Login Employee
    [HttpPost("login")]
    public async Task<IActionResult> LoginEmployee([FromBody] EmployeeLoginDto request)
    {
        var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeIdentifier == request.EmployeeIdentifier);

        if (employee == null || !VerifyPassword(request.Password, employee.PasswordHash))
            return Unauthorized("Invalid Employee ID or Password.");

        return Ok(new { message = "Login Successful", employeeId = employee.EmployeeIdentifier, role = employee.Role });
    }

    //Get Employees for a Specific Company
    [HttpGet("{companyId}/employees")]
    public async Task<IActionResult> GetEmployees(int companyId)
    {
        var employees = await _context.Employees.Where(e => e.CompanyId == companyId).ToListAsync();
        return Ok(employees);
    }

    [HttpPost]
    public async Task<IActionResult> AddEmployee([FromBody] EmployeeCreateDto employeeDto)
    {
        if (employeeDto == null)
        {
            return BadRequest("Employee data is required.");
        }

        try
        {
            var employee = new Employee
            {
                Name = employeeDto.Name,
                Email = employeeDto.Email,
                Role = employeeDto.Role,
                EmployeeIdentifier = employeeDto.EmployeeIdentifier,
                CompanyId = employeeDto.CompanyId,
                PasswordHash = HashPassword(employeeDto.Password)
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee added successfully!", employeeId = employee.EmployeeIdentifier });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while adding employee: {Message}", ex.Message);
            return StatusCode(500, new { message = "An error occurred while adding the employee. Please try again later.", error = ex.Message });
        }
    }

    // DELETE api/employee/{id}
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteEmployee(string id)
{
    var employee = await _context.Employees
        .FirstOrDefaultAsync(e => e.EmployeeIdentifier == id); 

    if (employee == null)
    {
        return NotFound(new { message = "Employee not found" });
    }

    _context.Employees.Remove(employee);
    await _context.SaveChangesAsync();

    return NoContent(); 
}

[HttpGet("search")]
    public async Task<IActionResult> SearchEmployee([FromQuery] string employeeId)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.EmployeeIdentifier == employeeId);

        if (employee == null)
            return NotFound(new { message = "Employee not found." });

        return Ok(employee);
    }

[HttpGet("notifications")]
    public async Task<IActionResult> GetNotifications([FromQuery] string employeeId)
    {
        if (string.IsNullOrEmpty(employeeId))
            return BadRequest(new { message = "Employee ID is required" });

        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.EmployeeIdentifier == employeeId);

        if (employee == null)
            return NotFound(new { message = "Employee not found." });

        var notifications = await _context.Notifications
            .Where(n => n.EmployeeId == employee.Id)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return Ok(notifications);
    }

    //Hash Password
    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    //Verify Password
    private bool VerifyPassword(string enteredPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(enteredPassword, storedHash);
    }
}
