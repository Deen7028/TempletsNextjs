import React from "react";

interface ShowProps {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Show: React.FC<ShowProps> = ({ when, fallback = null, children }) => {
  return when ? <>{children}</> : <>{fallback}</>;
};

interface EachProps<T> {
  of: T[];
  render: (item: T, index: number) => React.ReactNode;
}

export function Each<T>({ of, render }: EachProps<T>) {
  return <>{of.map((item, index) => render(item, index))}</>;
}
