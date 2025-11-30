export interface PaginatedList<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
}

export type Direction = 'next' | 'prev';
