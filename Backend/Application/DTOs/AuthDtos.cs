namespace Backend.Application.DTOs;

public class RegisterDto
{
    public string SFirstName { get; set; } = string.Empty;
    public string SLastName { get; set; } = string.Empty;
    public string SEmail { get; set; } = string.Empty;
    public string SPassword { get; set; } = string.Empty;
    public int NDepartmentId { get; set; }
    public string SRole { get; set; } = "Employee"; // "Employee" หรือ "Admin"
}

public class LoginDto
{
    public string SEmail { get; set; } = string.Empty;
    public string SPassword { get; set; } = string.Empty;
    public bool? IsRememberMe { get; set; }
}

public class UserDto
{
    public int NEmployeeId { get; set; }
    public string SFirstName { get; set; } = string.Empty;
    public string SLastName { get; set; } = string.Empty;
    public string SEmail { get; set; } = string.Empty;
    public string SRole { get; set; } = string.Empty;
    public int NDepartmentId { get; set; }
    public string? SDepartmentName { get; set; }
}

public class AuthResponseDto
{
    public string Status { get; set; } = "success";
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UserDto? ObjUser { get; set; }
}

public class UpdateProfileDto
{
    public int NEmployeeId { get; set; }
    public string SFirstName { get; set; } = string.Empty;
    public string SLastName { get; set; } = string.Empty;
    public int NDepartmentId { get; set; }
}

public class ChangePasswordDto
{
    public int NEmployeeId { get; set; }
    public string SCurrentPassword { get; set; } = string.Empty;
    public string SNewPassword { get; set; } = string.Empty;
}
