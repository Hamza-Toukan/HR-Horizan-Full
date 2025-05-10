using WebApplication1.Models;

public class LeaveRequest
{
    public int Id { get; set; }

    public string EmployeeId { get; set; } = string.Empty;
    public Employee Employee { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
}


public enum LeaveStatus
{
    Pending,
    Approved,
    Rejected 
}
