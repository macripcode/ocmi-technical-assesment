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
  placeholders: {
    timeEntries:   'Time Entries — coming soon.',
    weeklySummary: 'Weekly Summary — coming soon.',
  },
} as const;

export default en;
export type Translations = typeof en;
