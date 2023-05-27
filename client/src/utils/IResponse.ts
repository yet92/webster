export interface IResponse {
  status: number;
  message: string;
}

export interface IResponseWithData<T> extends IResponse {
  data: T;
}
