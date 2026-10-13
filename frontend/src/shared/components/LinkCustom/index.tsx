import Link, { LinkProps } from "next/link";
import React from "react";

export interface ILinkCustomProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
}

export default function LinkCustom({
  children,
  className,
  style,
  ...props
}: ILinkCustomProps) {
  return (
    <Link
      className={className}
      style={{ textDecoration: "none", color: "inherit", ...style }}
      {...props}
    >
      {children}
    </Link>
  );
}
