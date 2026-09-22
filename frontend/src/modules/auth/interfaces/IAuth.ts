export interface IDepartment {
  nDepartmentId: number;
  sDepartmentCode: string;
  sDepartmentName: string;
  isActive?: boolean;
}

export type UserRole = 'Employee' | 'Manager' | 'Admin';

export interface IUser {
  nEmployeeId: number;
  sFirstName: string;
  sLastName: string;
  sEmail: string;
  sRole: UserRole;
  nDepartmentId?: number | null;
  sDepartmentName?: string;
  isActive?: boolean;
}

export interface IEmployeeItem {
  nEmployeeId: number;
  sFirstName?: string;
  sLastName?: string;
  sEmail: string;
  sRole: string;
  nDepartmentId?: number | null;
  sDepartmentName?: string;
  sDepartmentCode?: string;
  isActive: boolean;
  dtCreatedAt: string;
}

export interface IRegisterRequest {
  sFirstName: string;
  sLastName: string;
  sEmail: string;
  sPassword: string;
  sConfirmPassword?: string;
  nDepartmentId?: number;
  sRole?: UserRole;
}

export interface ILoginRequest {
  sEmail: string;
  sPassword: string;
  isRememberMe?: boolean;
}

export interface IAuthResponse {
  token?: string;
  objUser?: IUser;
  message?: string;
  status: string;
}

export interface IUpdateProfileRequest {
  sFirstName: string;
  sLastName: string;
  nDepartmentId: number;
}

export interface IChangePasswordRequest {
  sCurrentPassword: string;
  sNewPassword: string;
  sConfirmNewPassword?: string;
}
