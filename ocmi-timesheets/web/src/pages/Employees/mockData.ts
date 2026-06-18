import type { Employee } from '../../types/employee';

export const mockEmployees: Employee[] = [
  { id: '1', name: 'Ana',    lastName: 'García',    hourlyRate: 28, status: 'ACTIVE',   createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-06-15') },
  { id: '2', name: 'Carlos', lastName: 'Rodríguez', hourlyRate: 24, status: 'ACTIVE',   createdAt: new Date('2026-02-20'), updatedAt: new Date('2026-04-08') },
  { id: '3', name: 'María',  lastName: 'López',     hourlyRate: 42, status: 'ACTIVE',   createdAt: new Date('2026-03-05'), updatedAt: new Date('2026-06-01') },
  { id: '4', name: 'Juan',   lastName: 'Martínez',  hourlyRate: 30, status: 'ACTIVE',   createdAt: new Date('2026-04-14'), updatedAt: new Date('2026-05-20') },
  { id: '5', name: 'Sofía',  lastName: 'Hernández', hourlyRate: 22, status: 'INACTIVE', createdAt: new Date('2026-05-30'), updatedAt: new Date('2026-06-10') },
];
