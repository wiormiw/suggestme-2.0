export interface PaginatedList<T> {
  items: T[];
  nextCursor: string | null;
}
