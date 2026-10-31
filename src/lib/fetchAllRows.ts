// Loads every row of a query, page by page (the API returns max 1000 rows per request).
export const PAGE_SIZE = 1000;

type PageResult<T> = PromiseLike<{ data: T[] | null; error: unknown }>;

export async function fetchAllRows<T>(
  buildPage: (from: number, to: number) => PageResult<T>,
): Promise<{ data: T[]; error: unknown }> {
  const all: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await buildPage(from, from + PAGE_SIZE - 1);
    if (error) return { data: all, error };
    const rows = data || [];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return { data: all, error: null };
}
