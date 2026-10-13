export interface ITableHeader {
  id: string;
  label: string;
  isSortable?: boolean;
  isAction?: boolean;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface ITableRows<T = any> {
  arrRows: T[];
  nDataLength: number;
  nPageIndex: number;
  nPageSize: number;
  sSortExpression?: string;
  sSortDirection?: "asc" | "desc";
}

export const initRows: ITableRows = {
  arrRows: [],
  nDataLength: 0,
  nPageIndex: 1,
  nPageSize: 10,
  sSortExpression: "",
  sSortDirection: "asc",
};
