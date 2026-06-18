import type { Employee } from '../../types/employee';

export const mockEmployees: Employee[] = [
  { id: '1', name: 'Ana García',       hourlyRate: 28, status: 'ACTIVE'   },
  { id: '2', name: 'Carlos Rodríguez', hourlyRate: 24, status: 'ACTIVE'   },
  { id: '3', name: 'María López',      hourlyRate: 42, status: 'ACTIVE'   },
  { id: '4', name: 'Juan Martínez',    hourlyRate: 30, status: 'ACTIVE'   },
  { id: '5', name: 'Sofía Hernández',  hourlyRate: 22, status: 'INACTIVE' },
];
