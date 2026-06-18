import type { TimeEntry } from '../../types/timeEntry';

const d = (date: string) => ({ createdAt: date, updatedAt: date });

export const mockTimeEntries: TimeEntry[] = [
  // Ana García (id: '1')
  { id: 'te1',  employeeId: '1', date: '2026-06-09', hoursWorked: 8.0,  ...d('2026-06-09') },
  { id: 'te2',  employeeId: '1', date: '2026-06-10', hoursWorked: 7.5,  ...d('2026-06-10') },
  { id: 'te3',  employeeId: '1', date: '2026-06-11', hoursWorked: 10.0, ...d('2026-06-11') },
  { id: 'te4',  employeeId: '1', date: '2026-06-12', hoursWorked: 8.0,  ...d('2026-06-12') },
  { id: 'te5',  employeeId: '1', date: '2026-06-13', hoursWorked: 6.5,  ...d('2026-06-13') },
  { id: 'te16', employeeId: '1', date: '2026-06-14', hoursWorked: 5.5,  ...d('2026-06-14') },
  // Carlos Rodríguez (id: '2')
  { id: 'te6',  employeeId: '2', date: '2026-06-09', hoursWorked: 8.0,  ...d('2026-06-09') },
  { id: 'te7',  employeeId: '2', date: '2026-06-10', hoursWorked: 8.0,  ...d('2026-06-10') },
  { id: 'te8',  employeeId: '2', date: '2026-06-11', hoursWorked: 7.0,  ...d('2026-06-11') },
  // María López (id: '3')
  { id: 'te9',  employeeId: '3', date: '2026-06-09', hoursWorked: 9.0,  ...d('2026-06-09') },
  { id: 'te10', employeeId: '3', date: '2026-06-10', hoursWorked: 8.5,  ...d('2026-06-10') },
  { id: 'te11', employeeId: '3', date: '2026-06-11', hoursWorked: 8.0,  ...d('2026-06-11') },
  { id: 'te12', employeeId: '3', date: '2026-06-12', hoursWorked: 9.5,  ...d('2026-06-12') },
  // Juan Martínez (id: '4')
  { id: 'te13', employeeId: '4', date: '2026-06-16', hoursWorked: 8.0,  ...d('2026-06-16') },
  { id: 'te14', employeeId: '4', date: '2026-06-17', hoursWorked: 8.0,  ...d('2026-06-17') },
  { id: 'te15', employeeId: '4', date: '2026-06-18', hoursWorked: 4.0,  ...d('2026-06-18') },
];
