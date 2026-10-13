export interface IAPIResult<T = any> {
  status?: string | number;
  message?: string;
  objResult?: T;
  data?: T;
}

export interface IPageParam {
  nPageIndex: number;
  nPageSize: number;
  sSortExpression?: string;
  sSortDirection?: "asc" | "desc";
}
