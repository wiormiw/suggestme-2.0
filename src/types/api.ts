type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  success: false;
  code: string;
  message: string;
  detail?: Record<string, unknown>;
};

export type { ApiSuccess, ApiFailure };
