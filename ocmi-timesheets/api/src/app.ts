import { Hono } from 'hono';
import { employeesRoutes } from './routes/employees';
import { healthRoutes } from './routes/health';
import { reportsRoutes } from './routes/reports';
import { timeEntriesRoutes } from './routes/time-entries';
import { weeklyTimesheetsRoutes } from './routes/weekly-timesheets';

export const app = new Hono();

app.route('/health', healthRoutes);
app.route('/employees', employeesRoutes);
app.route('/time-entries', timeEntriesRoutes);
app.route('/reports', reportsRoutes);
app.route('/weekly-timesheets', weeklyTimesheetsRoutes);
