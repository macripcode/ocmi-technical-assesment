import { useState } from 'react';
import type { Tab } from '../types/tab';
import { Navbar } from '../components/Navbar';
import { EmployeesPage }    from '../pages/Employees';
import { TimeEntriesPage }  from '../pages/TimeEntries';
import { WeeklySummaryPage } from '../pages/WeeklySummary';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('employees');

  return (
    <div className={styles.root}>
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.main}>
        <div className={styles.content}>
          {activeTab === 'employees'      && <EmployeesPage />}
          {activeTab === 'time-entries'   && <TimeEntriesPage />}
          {activeTab === 'weekly-summary' && <WeeklySummaryPage />}
        </div>
      </main>
    </div>
  );
}
