import { describe, it, expect } from 'vitest';
import { fetchAllRows } from './fetchAllRows';

describe('fetchAllRows', () => {
  it('charge les 1022 réservations, pas seulement 1000', async () => {
    const db = Array.from({ length: 1022 }, (_, i) => i);
    const { data } = await fetchAllRows((from, to) => Promise.resolve({ data: db.slice(from, to + 1), error: null }));
    expect(data.length).toBe(1022);
    expect(data[1021]).toBe(1021);
  });
});
