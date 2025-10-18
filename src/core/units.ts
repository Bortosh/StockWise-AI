// src/core/units.ts
export type Unit = 'unit' | 'kg' | 'g' | 'L' | 'ml';

export function toBase(qty: number, from: Unit, base: Unit): number {
    const map: Record<string, number> = {
        'g->kg': 1 / 1000, 'kg->g': 1000,
        'ml->L': 1 / 1000, 'L->ml': 1000,
    };
    if (from === base) return qty;
    const key = `${from}->${base}`;
    const f = map[key];
    if (f == null) throw new Error(`Missing conversion: ${key}`);
    return qty * f;
}
