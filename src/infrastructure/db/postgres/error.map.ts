import { AppError } from '@/common/errors/app.error';

interface PostgresError extends Error {
  code: string;
  constraints?: string;
  detail?: string;
}

export const mapPostgresError = (error: unknown) => {
  if (error instanceof AppError) return error;

  const pgError = error as PostgresError;

  if (pgError.code) {
    switch (pgError.code) {
      case '23505':
        return new AppError('CONFLICT', 'Resource already exists.', 409);
      case '23503':
        return new AppError('BAD_REQUEST', 'Invalid reference.', 400);
    }
  }

  return new AppError('DB_ERROR', 'Database operation failed.', 500);
};
