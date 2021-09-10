export interface CoreOutput {
  ok: boolean;
  error?: string;
}

export interface CoreEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationInput {
  page: number;
}

export interface PaginationOutput extends CoreOutput {
  totalPages?: number;
  totalResults?: number;
}

