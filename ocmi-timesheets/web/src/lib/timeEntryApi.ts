import type { TimeEntry } from '../types/timeEntry';

const BASE = '/api/time-entries';

interface TimeEntryApiResponse {
  id:          string;
  employeeId:  string;
  date:        string; // ISO datetime from DB: "2026-06-16T00:00:00.000Z"
  hoursWorked: number;
  createdAt:   string;
  updatedAt:   string;
}

function mapEntry(raw: TimeEntryApiResponse): TimeEntry {
  return {
    id:          raw.id,
    employeeId:  raw.employeeId,
    date:        raw.date.split('T')[0], // "2026-06-16T00:00:00.000Z" → "2026-06-16"
    hoursWorked: raw.hoursWorked,
    createdAt:   raw.createdAt,
    updatedAt:   raw.updatedAt,
  };
}

export async function fetchTimeEntries(employeeId: string): Promise<TimeEntry[]> {
  const res = await fetch(`${BASE}?employeeId=${encodeURIComponent(employeeId)}`);
  if (!res.ok) throw new Error('Failed to fetch time entries');
  const data: TimeEntryApiResponse[] = await res.json();
  return data.map(mapEntry);
}

export async function createTimeEntry(payload: {
  employeeId:  string;
  date:        string;
  hoursWorked: number;
}): Promise<TimeEntry> {
  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (res.status === 409) throw new Error('LOCKED');
  if (!res.ok)            throw new Error('Failed to create time entry');
  return mapEntry(await res.json());
}

export async function updateTimeEntry(
  id:      string,
  payload: { date?: string; hoursWorked?: number },
): Promise<TimeEntry> {
  const res = await fetch(`${BASE}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (res.status === 409) throw new Error('LOCKED');
  if (!res.ok)            throw new Error('Failed to update time entry');
  return mapEntry(await res.json());
}

export async function deleteTimeEntry(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (res.status === 409) throw new Error('LOCKED');
  if (!res.ok)            throw new Error('Failed to delete time entry');
}
