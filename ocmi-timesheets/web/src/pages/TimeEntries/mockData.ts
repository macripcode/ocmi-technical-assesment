import type { TimeEntry } from '../../types/timeEntry';

// Employee IDs match mockEmployees in pages/Employees/mockData.ts
export const mockTimeEntries: TimeEntry[] = [
  // Ana García (id: '1')
  { id: 'te1',  employeeId: '1', date: '2026-06-09', hours: 8.0 },
  { id: 'te2',  employeeId: '1', date: '2026-06-10', hours: 7.5 },
  { id: 'te3',  employeeId: '1', date: '2026-06-11', hours: 10.0 },
  { id: 'te4',  employeeId: '1', date: '2026-06-12', hours: 8.0 },
  { id: 'te5',  employeeId: '1', date: '2026-06-13', hours: 6.5 },
  // Carlos Rodríguez (id: '2')
  { id: 'te6',  employeeId: '2', date: '2026-06-09', hours: 8.0 },
  { id: 'te7',  employeeId: '2', date: '2026-06-10', hours: 8.0 },
  { id: 'te8',  employeeId: '2', date: '2026-06-11', hours: 7.0 },
  // María López (id: '3')
  { id: 'te9',  employeeId: '3', date: '2026-06-09', hours: 9.0 },
  { id: 'te10', employeeId: '3', date: '2026-06-10', hours: 8.5 },
  { id: 'te11', employeeId: '3', date: '2026-06-11', hours: 8.0 },
  { id: 'te12', employeeId: '3', date: '2026-06-12', hours: 9.5 },
  // Juan Martínez (id: '4')
  { id: 'te13', employeeId: '4', date: '2026-06-16', hours: 8.0 },
  { id: 'te14', employeeId: '4', date: '2026-06-17', hours: 8.0 },
  { id: 'te15', employeeId: '4', date: '2026-06-18', hours: 4.0 },
  // Ana García overtime — pushes her Jun 08-14 week to 45.5 h (5.5 h OT)
  { id: 'te16', employeeId: '1', date: '2026-06-14', hours: 5.5 },
  // Sofía Hernández (id: '5') — inactive, intentionally no entries
];
