import { describe, it, expect } from 'vitest';
import { fetchAllRows } from '../src/lib/fetchAllRows';

describe('rush décembre', () => {
  it('charge les 3 500 réservations sans en perdre', async () => {
    const rows = Array.from({ length: 3500 }, (_, i) => ({ id: i }));
    const { data } = await fetchAllRows((from, to) => Promise.resolve({ data: rows.slice(from, to + 1), error: null }));
    expect(data.length).toBe(3500);
    expect(new Set(data.map((r) => r.id)).size).toBe(3500);
  });
});
