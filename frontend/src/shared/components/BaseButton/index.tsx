"use client";

import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

export interface IBaseButtonProps extends Omit<ButtonProps, "href"> {
  href?: string;
  isIconOnly?: boolean;
}

export const BaseButton: React.FC<IBaseButtonProps> = ({
  children,
  href,
  sx,
  ...props
}) => {
  const baseSx = {
    textTransform: "none",
    borderRadius: "var(--radius-md)",
    fontWeight: 500,
    ...sx,
  };

  if (href) {
    return (
      <Button component={Link} href={href} sx={baseSx} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button sx={baseSx} {...props}>
      {children}
    </Button>
  );
};

export const BtnSearch: React.FC<IBaseButtonProps> = ({ isIconOnly, ...props }) => {
  if (isIconOnly) {
    return (
      <IconButton color="primary" {...(props as any)}>
        <SearchIcon />
      </IconButton>
    );
  }
  return (
    <BaseButton variant="contained" startIcon={<SearchIcon />} {...props}>
      ค้นหา
    </BaseButton>
  );
};

export const BtnClear: React.FC<IBaseButtonProps> = ({ isIconOnly, ...props }) => {
  if (isIconOnly) {
    return (
      <IconButton color="default" {...(props as any)}>
        <ClearIcon />
      </IconButton>
    );
  }
  return (
    <BaseButton variant="outlined" color="inherit" startIcon={<ClearIcon />} {...props}>
      ล้างข้อมูล
    </BaseButton>
  );
};

export const BtnAdd: React.FC<IBaseButtonProps> = ({ isIconOnly, ...props }) => {
  if (isIconOnly) {
    return (
      <IconButton color="primary" {...(props as any)}>
        <AddIcon />
      </IconButton>
    );
  }
  return (
    <BaseButton variant="contained" color="primary" startIcon={<AddIcon />} {...props}>
      เพิ่มข้อมูล
    </BaseButton>
  );
};

export const BtnSave: React.FC<IBaseButtonProps> = (props) => (
  <BaseButton variant="contained" color="primary" startIcon={<SaveIcon />} {...props}>
    บันทึก
  </BaseButton>
);

export const BtnDelete: React.FC<IBaseButtonProps> = (props) => (
  <BaseButton variant="contained" color="error" startIcon={<DeleteIcon />} {...props}>
    ลบ
  </BaseButton>
);

export const BtnBack: React.FC<IBaseButtonProps> = (props) => (
  <BaseButton variant="outlined" color="inherit" startIcon={<ArrowBackIcon />} {...props}>
    ย้อนกลับ
  </BaseButton>
);
