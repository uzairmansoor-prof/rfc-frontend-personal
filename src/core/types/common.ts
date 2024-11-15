export interface PaginationResponseDTO<T> {
  content: Array<T>;
  // totalPages: number;
  totalRecords: number;
}

export interface GenericResponse<T> {
  data: T;
  message: string;
  code: string;
}
