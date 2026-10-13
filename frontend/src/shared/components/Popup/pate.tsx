"use client";

import React from "react";
import { usePopupStore, IPopupConfig } from "@/stores/usePopupStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export const PopupContainer: React.FC = () => {
  const isOpen = usePopupStore((s) => s.isOpen);
  const config = usePopupStore((s) => s.config);
  const closePopup = usePopupStore((s) => s.closePopup);

  if (!config) return null;

  const handleConfirm = async () => {
    if (config.onConfirm) {
      await config.onConfirm();
    }
    closePopup();
  };

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
    closePopup();
  };

  const isConfirm = config.type === "confirm";

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
        {config.title}
      </DialogTitle>
      {config.message && (
        <DialogContent>
          <DialogContentText sx={{ color: "var(--color-text-secondary)" }}>
            {config.message}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        {isConfirm && (
          <Button
            onClick={handleCancel}
            sx={{
              color: "var(--color-text-secondary)",
              textTransform: "none",
            }}
          >
            {config.cancelText || "ยกเลิก"}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={config.type === "confirm" ? "error" : "primary"}
          sx={{ textTransform: "none", borderRadius: "var(--radius-md)" }}
        >
          {config.confirmText || "ตกลง"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { PopupDelete, PopupAlert } from "@/stores/usePopupStore";
