export interface CoreOutput {
  ok: boolean;
  error?: string;
}

export interface CoreEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
