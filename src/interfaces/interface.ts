export interface CoreOutput {
  ok: boolean;
  error?: string;
}

export interface SignUpOutput extends CoreOutput {}

export interface LoginOutput extends CoreOutput {
  token?: string;
}
