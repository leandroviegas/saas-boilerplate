


export interface DefaultResponse {
  message?: string;
  code: string;
}

export interface DataSuccessResponse<T> extends DefaultResponse {
  data: T;
}


export interface PaginatedSuccessResponse<T> extends DataSuccessResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ErrorResponse extends DefaultResponse {
  errors: {
    message: string;
    code?: string;
  }[]
}