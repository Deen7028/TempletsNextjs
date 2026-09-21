export interface IApiResponse<T = object> {
    status: string;
    message?: string;
    data?: T;
}
