"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Skeleton,
  FormHelperText,
} from "@mui/material";

export interface IInputBaseProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  isSkeleton?: boolean;
  placeholder?: string;
  helperText?: string;
}

// 1. TextBoxItem
export interface ITextBoxProps extends IInputBaseProps {
  type?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TextBoxItem: React.FC<ITextBoxProps> = ({
  name,
  label,
  required,
  disabled,
  isSkeleton,
  placeholder,
  type = "text",
  onKeyDown,
}) => {
  const { control } = useFormContext();

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={42} width="100%" />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size="small"
          onKeyDown={onKeyDown}
        />
      )}
    />
  );
};

// 2. TextAreaItem
export interface ITextAreaProps extends IInputBaseProps {
  rows?: number;
}

export const TextAreaItem: React.FC<ITextAreaProps> = ({
  name,
  label,
  required,
  disabled,
  isSkeleton,
  placeholder,
  rows = 3,
}) => {
  const { control } = useFormContext();

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={80} width="100%" />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          multiline
          rows={rows}
          label={label}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size="small"
        />
      )}
    />
  );
};

// 3. SelectItem
export interface IOptionItem {
  label: string;
  value: string | number;
}

export interface ISelectProps extends IInputBaseProps {
  options?: IOptionItem[];
}

export const SelectItem: React.FC<ISelectProps> = ({
  name,
  label,
  required,
  disabled,
  isSkeleton,
  options = [],
}) => {
  const { control } = useFormContext();

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={42} width="100%" />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth size="small" error={!!error} disabled={disabled}>
          {label && <InputLabel required={required}>{label}</InputLabel>}
          <Select {...field} label={label} value={field.value ?? ""}>
            <MenuItem value="">
              <em>-- เลือก --</em>
            </MenuItem>
            {options.map((opt) => (
              <MenuItem key={String(opt.value)} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

// 4. DatePickerItem (HTML5 fallback native date)
export const DatePickerItem: React.FC<IInputBaseProps> = ({
  name,
  label,
  required,
  disabled,
  isSkeleton,
}) => {
  const { control } = useFormContext();

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={42} width="100%" />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="date"
          label={label}
          required={required}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
          fullWidth
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
      )}
    />
  );
};

// 5. CheckBoxItem
export const CheckBoxItem: React.FC<IInputBaseProps> = ({
  name,
  label,
  disabled,
  isSkeleton,
}) => {
  const { control } = useFormContext();

  if (isSkeleton) {
    return <Skeleton variant="rounded" height={30} width={120} />;
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  );
};
