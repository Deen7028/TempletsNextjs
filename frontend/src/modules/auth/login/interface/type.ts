export interface ILoginRequest {
  sEmail: string;
  sPassword: string;
  isRememberMe?: boolean;
}

export interface IUser {
  nEmployeeId: number;
  sFirstName: string;
  sLastName: string;
  sEmail: string;
  sRole: string;
  nDepartmentId?: number | null;
  sDepartmentName?: string;
  isActive?: boolean;
}

export interface IAuthResponse {
  token?: string;
  objUser?: IUser;
  message?: string;
  status: string;
}

export interface ILoginFormData extends ILoginRequest {
  sUsername?: string;
  sAccessCode?: string;
}
