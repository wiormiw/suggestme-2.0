type ApiSuccess<T> = {
  requestId: string;
  success: true;
  message: string;
  data: T;
};

type ApiFailure = {
  requestId: string;
  success: false;
  code: string;
  message: string;
  detail?: Record<string, unknown>;
};

export type { ApiSuccess, ApiFailure };
