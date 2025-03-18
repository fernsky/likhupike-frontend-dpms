export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
  meta?: ApiPaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown | null;
    status: number;
  };
}

export interface ApiPaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
