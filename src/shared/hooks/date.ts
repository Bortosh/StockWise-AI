// src/shared/date.ts
export function todayLocal(): string {
    const d = new Date()
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 10) // YYYY-MM-DD en hora local
}