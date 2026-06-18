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
    sort: {
      label:     'Ordenar por',
      name:      'Nombre',
      lastName:  'Apellido',
      createdAt: 'Fecha de creación',
      updatedAt: 'Fecha de actualización',
      asc:       'A → Z',
      desc:      'Z → A',
      newest:    'Más reciente primero',
      oldest:    'Más antiguo primero',
    },
    empty: 'No se encontraron empleados.',
    form: {
      titleAdd:   'Agregar Empleado',
      titleEdit:  'Editar Empleado',
      name:       'Nombre',
      lastName:   'Apellido',
      hourlyRate: 'Tarifa por hora ($/hr)',
      save:       'Guardar',
      cancel:     'Cancelar',
    },
  },
  timeEntries: {
    title:          'Registros de Tiempo',
    selectEmployee: 'Empleado',
    addEntry:       '+ Registrar tiempo',
    form: {
      label: 'Registrar tiempo',
      date:  'Fecha',
      hours: 'Horas',
      save:  'Guardar',
    },
    actions: {
      edit:   'Editar registro',
      delete: 'Eliminar registro',
    },
    empty: 'No hay registros para este empleado.',
  },
  weeklySummary: {
    title:     'Resumen Semanal',
    weekOf:    'Semana del',
    regular:   'Regular',
    overtime:  'Horas extra',
    pay:       'Pago',
    locked:    'Bloqueado',
    noEntries: 'No hay registros esta semana.',
    actions: {
      approve: 'Aprobar',
      reject:  'Rechazar',
    },
    status: {
      pending:  'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
    },
  },
};

export default es;
