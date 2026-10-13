import { create } from "zustand";

export type PopupType = "info" | "success" | "warning" | "error" | "confirm";

export interface IPopupConfig {
  id?: string;
  type?: PopupType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface PopupState {
  isOpen: boolean;
  config: IPopupConfig | null;
  openPopup: (config: IPopupConfig) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  isOpen: false,
  config: null,
  openPopup: (config) => set({ isOpen: true, config }),
  closePopup: () => set({ isOpen: false, config: null }),
}));

// Static helpers matching README-Frontend.md
export const PopupDelete = (
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void
) => {
  usePopupStore.getState().openPopup({
    type: "confirm",
    title,
    message,
    confirmText: "ลบ",
    cancelText: "ยกเลิก",
    onConfirm,
    onCancel,
  });
};

export const PopupAlert = (
  title: string,
  message?: string,
  type: PopupType = "info"
) => {
  usePopupStore.getState().openPopup({
    type,
    title,
    message,
    confirmText: "ตกลง",
  });
};
