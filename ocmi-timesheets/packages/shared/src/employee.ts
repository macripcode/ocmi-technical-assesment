export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  status: EmployeeStatus;
  deactivatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEmployeeInput {
  name: string;
  role: string;
  hourlyRate: number;
  status?: EmployeeStatus;
}
