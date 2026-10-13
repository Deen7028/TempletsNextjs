"use client";

import React from "react";
import { FormProvider } from "react-hook-form";
import Grid from "@/shared/components/Grid";
import { TextBoxItem, CheckBoxItem } from "@/shared/components/Input";
import { BaseButton } from "@/shared/components/BaseButton";
import LinkCustom from "@/shared/components/LinkCustom";
import { Card, CardContent, Typography, Alert, Box } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styles from "../css/LoginForm.module.css";
import { useLoginForm } from "../hooks/useLoginForm";

export const LoginForm: React.FC = () => {
  const { form, handleLogin, errorMessage, t } = useLoginForm();

  return (
    <div className={styles.loginWrapper}>
      <Card
        elevation={0}
        className={styles.loginCard}
      >
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--color-primary-light)",
                color: "var(--color-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {t("auth.login.title", "เข้าสู่ระบบ")}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--color-text-secondary)", mt: 0.5 }}>
              ระบบจัดการคำขอสั่งซื้อ (PO System)
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "var(--radius-md)" }}>
              {errorMessage}
            </Alert>
          )}

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12 }}>
                  <TextBoxItem
                    name="sEmail"
                    label={t("auth.login.email", "อีเมล / ชื่อผู้ใช้")}
                    placeholder="user@railayresort.com"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextBoxItem
                    name="sPassword"
                    type="password"
                    label={t("auth.login.password", "รหัสผ่าน")}
                    placeholder="••••••••"
                    required
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <CheckBoxItem name="isRememberMe" label="จดจำฉันไว้ในระบบ" />
                    <LinkCustom
                      href="/reset-password"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {t("auth.login.forgot", "ลืมรหัสผ่าน?")}
                    </LinkCustom>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <BaseButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.25,
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    {t("auth.login.button", "เข้าสู่ระบบ")}
                  </BaseButton>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ textAlign: "center", mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "var(--color-text-secondary)" }}>
                    ยังไม่มีบัญชีผู้ใช้?{" "}
                    <LinkCustom
                      href="/register"
                      style={{
                        color: "var(--color-primary)",
                        fontWeight: 600,
                      }}
                    >
                      ลงทะเบียน
                    </LinkCustom>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};
