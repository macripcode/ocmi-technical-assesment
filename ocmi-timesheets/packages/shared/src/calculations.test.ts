import { describe, it, expect } from 'vitest';
import { calculateWeeklySummary, getWeekStart } from './calculations.ts';

describe('calculateWeeklySummary', () => {
  const RATE = 20;

  it('under 40h: all regular, no overtime', () => {
    const result = calculateWeeklySummary(35, RATE);
    expect(result).toEqual({ regularHours: 35, overtimeHours: 0, regularPay: 700, overtimePay: 0, totalPay: 700 });
  });

  it('exactly 40h: no overtime', () => {
    const result = calculateWeeklySummary(40, RATE);
    expect(result).toEqual({ regularHours: 40, overtimeHours: 0, regularPay: 800, overtimePay: 0, totalPay: 800 });
  });

  it('over 40h: overtime billed at 1.5×', () => {
    // 40 * 20 + 5 * 20 * 1.5 = 800 + 150 = 950
    const result = calculateWeeklySummary(45, RATE);
    expect(result).toEqual({ regularHours: 40, overtimeHours: 5, regularPay: 800, overtimePay: 150, totalPay: 950 });
  });

  it('decimal hours (40.5h): half-hour overtime', () => {
    // 40 * 20 + 0.5 * 20 * 1.5 = 800 + 15 = 815
    const result = calculateWeeklySummary(40.5, RATE);
    expect(result).toEqual({ regularHours: 40, overtimeHours: 0.5, regularPay: 800, overtimePay: 15, totalPay: 815 });
  });
});

describe('getWeekStart', () => {
  it('mid-week date returns the Monday of that week', () => {
    // Wednesday 2024-01-10 → Monday 2024-01-08
    expect(getWeekStart(new Date('2024-01-10T12:00:00Z'))).toEqual(
      new Date('2024-01-08T00:00:00Z')
    );
  });

  it('a Monday returns itself (normalized to midnight UTC)', () => {
    expect(getWeekStart(new Date('2024-01-08T15:30:00Z'))).toEqual(
      new Date('2024-01-08T00:00:00Z')
    );
  });

  it('Sunday shifts back to the previous Monday', () => {
    // Sunday 2024-01-14 belongs to the week starting 2024-01-08
    expect(getWeekStart(new Date('2024-01-14T00:00:00Z'))).toEqual(
      new Date('2024-01-08T00:00:00Z')
    );
  });
});

/**
 * Simulates the week-scoped aggregation the reports route performs:
 * filter entries to [weekStart, weekStart+7d) then sum hours.
 */
function sumHoursForWeek(
  entries: { date: Date; hoursWorked: number }[],
  weekOf: Date
): number {
  const weekStart = getWeekStart(weekOf);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 7);
  return entries
    .filter((e) => e.date >= weekStart && e.date < weekEnd)
    .reduce((sum, e) => sum + e.hoursWorked, 0);
}

describe('crossing-week filtering', () => {
  it('entries from different weeks are counted separately', () => {
    const entries = [
      { date: new Date('2024-01-10T00:00:00Z'), hoursWorked: 30 }, // week of Jan 8
      { date: new Date('2024-01-17T00:00:00Z'), hoursWorked: 25 }, // week of Jan 15
    ];

    const hoursWeek1 = sumHoursForWeek(entries, new Date('2024-01-10T00:00:00Z'));
    const hoursWeek2 = sumHoursForWeek(entries, new Date('2024-01-15T00:00:00Z'));

    expect(hoursWeek1).toBe(30);
    expect(hoursWeek2).toBe(25);

    // Neither week reaches overtime individually
    expect(calculateWeeklySummary(hoursWeek1, 20).overtimeHours).toBe(0);
    expect(calculateWeeklySummary(hoursWeek2, 20).overtimeHours).toBe(0);
  });

  it('an entry on Sunday is inside the week; the following Monday is outside', () => {
    const entries = [
      { date: new Date('2024-01-14T23:59:59Z'), hoursWorked: 8 }, // Sunday — last day of week Jan 8
      { date: new Date('2024-01-15T00:00:00Z'), hoursWorked: 8 }, // Monday — first day of week Jan 15
    ];

    expect(sumHoursForWeek(entries, new Date('2024-01-08T00:00:00Z'))).toBe(8);
  });

  it('entries spanning two weeks do not inflate overtime for either week', () => {
    // 25 hours in week 1, 20 hours in week 2 — combined would be 45h (overtime),
    // but each week is under 40h so neither should trigger overtime.
    const entries = [
      { date: new Date('2024-01-08T00:00:00Z'), hoursWorked: 25 },
      { date: new Date('2024-01-15T00:00:00Z'), hoursWorked: 20 },
    ];

    const { overtimeHours: ot1 } = calculateWeeklySummary(
      sumHoursForWeek(entries, new Date('2024-01-08T00:00:00Z')),
      20
    );
    const { overtimeHours: ot2 } = calculateWeeklySummary(
      sumHoursForWeek(entries, new Date('2024-01-15T00:00:00Z')),
      20
    );

    expect(ot1).toBe(0);
    expect(ot2).toBe(0);
  });
});
