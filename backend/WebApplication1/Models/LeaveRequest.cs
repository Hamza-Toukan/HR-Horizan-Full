public class LeaveRequest
{
    public int Id { get; set; }
    public string EmployeeId { get; set; }  = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
}
