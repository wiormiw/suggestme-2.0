import { AppError } from '@/common/errors/app.error';
import { log } from '@/common/utils/standalone.logger';

interface PostgresError extends Error {
  code: string;
  constraints?: string;
  detail?: string;
}

const isPostgresError = (e: any): e is PostgresError => {
  return typeof e === 'object' && e !== null && 'code' in e && typeof e.code === 'string';
};

export const mapPostgresError = (error: unknown) => {
  log.error(error);

  if (error instanceof AppError) return error;

  if (isPostgresError(error)) {
    switch (error.code) {
      case '23505':
        return new AppError('CONFLICT', 'Resource already exists.', 409);
      case '23503':
        return new AppError('BAD_REQUEST', 'Invalid reference.', 400);
    }
  }

  return new AppError('DB_ERROR', 'Database operation failed.', 500);
};
