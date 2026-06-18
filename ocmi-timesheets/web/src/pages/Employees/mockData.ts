import type { Employee } from '../../types/employee';

export const mockEmployees: Employee[] = [
  { id: '1', name: 'Ana García',      role: 'Frontend Developer', hourlyRate: 28, status: 'ACTIVE'   },
  { id: '2', name: 'Carlos Rodríguez',role: 'UX Designer',        hourlyRate: 24, status: 'ACTIVE'   },
  { id: '3', name: 'María López',     role: 'Engineering Manager',hourlyRate: 42, status: 'ACTIVE'   },
  { id: '4', name: 'Juan Martínez',   role: 'Backend Developer',  hourlyRate: 30, status: 'ACTIVE'   },
  { id: '5', name: 'Sofía Hernández', role: 'QA Engineer',        hourlyRate: 22, status: 'INACTIVE' },
];
