import type { Translations } from './en';

const es: Translations = {
  nav: {
    employees:     'Empleados',
    timeEntries:   'Registros de Tiempo',
    weeklySummary: 'Resumen Semanal',
  },
  common: {
    theme: { light: 'Claro', dark: 'Oscuro' },
  },
  employees: {
    title:        'Empleados',
    addEmployee:  'Agregar Empleado',
    showInactive: 'Mostrar Inactivos',
    table: {
      name:       'Nombre',
      role:       'Rol',
      hourlyRate: 'Tarifa por Hora',
      status:     'Estado',
      actions:    'Acciones',
    },
    status: {
      active:   'Activo',
      inactive: 'Inactivo',
    },
    actions: {
      edit:       'Editar',
      deactivate: 'Desactivar',
      reactivate: 'Reactivar',
    },
    empty: 'No se encontraron empleados.',
  },
  placeholders: {
    timeEntries:   'Registros de Tiempo — próximamente.',
    weeklySummary: 'Resumen Semanal — próximamente.',
  },
};

export default es;
