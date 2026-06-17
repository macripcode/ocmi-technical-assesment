export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function calculateWeeklySummary(totalHours: number, hourlyRate: number) {
  const regularHours = Math.min(totalHours, 40);
  const overtimeHours = Math.max(0, totalHours - 40);
  const totalPay = regularHours * hourlyRate + overtimeHours * hourlyRate * 1.5;
  return { regularHours, overtimeHours, totalPay };
}
