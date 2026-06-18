import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import { EmployeesPage }    from '../pages/Employees';
import { TimeEntriesPage }  from '../pages/TimeEntries';
import { WeeklySummaryPage } from '../pages/WeeklySummary';
import styles from './AppLayout.module.css';

type Tab = 'employees' | 'time-entries' | 'weekly-summary';

export function AppLayout() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('employees');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'employees',      label: t('nav.employees')     },
    { id: 'time-entries',   label: t('nav.timeEntries')   },
    { id: 'weekly-summary', label: t('nav.weeklySummary') },
  ];

  return (
    <div className={styles.root}>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navInner}>
          <span className={styles.brand}>OCMI Timesheets</span>

          <div className={styles.tabs} role="tablist">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.controls}>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

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
