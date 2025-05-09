public class EmployeeCreateDto
{
    public string Name { get; set; }= string.Empty;
    public string Email { get; set; }= string.Empty;
    public string Role { get; set; }  = string.Empty;
    public string EmployeeIdentifier { get; set; }= string.Empty;
    public int CompanyId { get; set; }
    public string Password { get; set; } = string.Empty;
}
