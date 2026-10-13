"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { BlockUI } from "@/shared/components/BlockUI";
import { PopupAlert } from "@/shared/components/Popup/pate";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { onLoginAction } from "../actions/loginAction";
import { ILoginRequest } from "../interface/type";

export function useLoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { t } = useTranslation(["auth", "common"]);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<ILoginRequest>({
    mode: "onBlur",
    defaultValues: {
      sEmail: "",
      sPassword: "",
      isRememberMe: false,
    },
  });

  const handleLogin = async (data?: ILoginRequest) => {
    const payload = data || form.getValues();
    if (!payload.sEmail || !payload.sPassword) {
      setErrorMessage("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setErrorMessage("");
    BlockUI.Show("กำลังเข้าสู่ระบบ...");

    const response = await onLoginAction(payload);
    BlockUI.Close();

    if (response?.status === "success" && response.objUser) {
      setAuth(response.token || "session-token", null, {
        id: String(response.objUser.nEmployeeId),
        sUsername: response.objUser.sEmail,
        sName: `${response.objUser.sFirstName} ${response.objUser.sLastName}`,
        sEmail: response.objUser.sEmail,
        sRole: response.objUser.sRole,
      });

      router.push("/showcase");
    } else {
      const msg = response?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
      setErrorMessage(msg);
      PopupAlert("เข้าสู่ระบบไม่สำเร็จ", msg, "error");
    }
  };

  return {
    form,
    handleLogin,
    errorMessage,
    t,
  };
}
