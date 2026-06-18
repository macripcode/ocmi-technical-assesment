import type { Employee } from '../types/employee';

const BASE = '/api/employees';

interface EmployeeApiResponse {
  id: string;
  name: string;
  lastName: string;
  hourlyRate: number;
  status: 'ACTIVE' | 'INACTIVE';
  deactivatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapEmployee(raw: EmployeeApiResponse): Employee {
  return {
    id:         raw.id,
    name:       raw.name,
    lastName:   raw.lastName,
    hourlyRate: raw.hourlyRate,
    status:     raw.status,
    createdAt:  new Date(raw.createdAt),
    updatedAt:  new Date(raw.updatedAt),
  };
}

export async function fetchEmployees(includeInactive = false): Promise<Employee[]> {
  const url = includeInactive ? `${BASE}?includeInactive=true` : BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch employees');
  const data: EmployeeApiResponse[] = await res.json();
  return data.map(mapEmployee);
}

export async function createEmployee(
  payload: { name: string; lastName: string; hourlyRate: number }
): Promise<Employee> {
  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return mapEmployee(await res.json());
}

export async function updateEmployee(
  id: string,
  payload: { name?: string; lastName?: string; hourlyRate?: number }
): Promise<Employee> {
  const res = await fetch(`${BASE}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return mapEmployee(await res.json());
}

export async function deactivateEmployee(id: string): Promise<Employee> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to deactivate employee');
  return mapEmployee(await res.json());
}
