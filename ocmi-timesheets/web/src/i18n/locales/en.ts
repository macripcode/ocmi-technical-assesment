const en = {
  nav: {
    employees:     'Employees',
    timeEntries:   'Time Entries',
    weeklySummary: 'Weekly Summary',
  },
  common: {
    theme: { light: 'Light', dark: 'Dark' },
  },
  employees: {
    title:        'Employees',
    addEmployee:  'Add Employee',
    showInactive: 'Show Inactive',
    table: {
      name:       'Name',
      role:       'Role',
      hourlyRate: 'Hourly Rate',
      status:     'Status',
      actions:    'Actions',
    },
    status: {
      active:   'Active',
      inactive: 'Inactive',
    },
    actions: {
      edit:       'Edit',
      deactivate: 'Deactivate',
      reactivate: 'Reactivate',
    },
    empty: 'No employees found.',
  },
  timeEntries: {
    title:          'Time Entries',
    selectEmployee: 'Employee',
    addEntry:       '+ Log time',
    form: {
      label: 'Log time',
      date:  'Date',
      hours: 'Hours',
      save:  'Save',
    },
    actions: {
      edit:   'Edit entry',
      delete: 'Delete entry',
    },
    empty: 'No time entries for this employee.',
  },
  placeholders: {
    weeklySummary: 'Weekly Summary — coming soon.',
  },
} as const;

export default en;

// Recursively replaces all leaf types with string so Spanish translations
// are not forced to match the exact English literal values.
type DeepString<T> = T extends object
  ? { [K in keyof T]: DeepString<T[K]> }
  : string;

export type Translations = DeepString<typeof en>;
