"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, color: "var(--color-primary)", mb: 1 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        ไม่พบหน้าที่คุณต้องการ
      </Typography>
      <Typography variant="body1" sx={{ color: "var(--color-text-secondary)", mb: 3 }}>
        หน้าเว็บที่คุณกำลังเข้าชมอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ
      </Typography>
      <Button
        component={Link}
        href="/"
        variant="contained"
        sx={{
          borderRadius: "var(--radius-md)",
          textTransform: "none",
        }}
      >
        กลับสู่หน้าหลัก
      </Button>
    </Box>
  );
}
