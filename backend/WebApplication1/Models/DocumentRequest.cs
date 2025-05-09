public class DocumentRequest
{
    public int Id { get; set; }
    public string EmployeeId { get; set; }  = string.Empty;
    public string HRId { get; set; }  = string.Empty;
    public string RequestText { get; set; }  = string.Empty;
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
}
