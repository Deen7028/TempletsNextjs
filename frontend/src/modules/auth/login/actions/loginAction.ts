"use server";

import { apiClient } from "@/shared/services/apiClient";
import { ILoginRequest, IAuthResponse } from "../interface/type";

export async function onLoginAction(payload: ILoginRequest): Promise<IAuthResponse> {
  try {
    const result = await apiClient.post<IAuthResponse>("/api/auth/login", payload);
    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    return {
      status: "error",
      message: msg,
    };
  }
}

export async function onLogoutAction(): Promise<void> {
  try {
    await apiClient.post("/api/auth/logout");
  } catch {
    // ignore
  }
}
