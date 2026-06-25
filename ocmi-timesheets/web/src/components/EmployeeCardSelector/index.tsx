import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Employee } from '../../types/employee';
import { SearchIcon, ChevronDownIcon, KeyboardIcon } from '../Icons';
import styles from './EmployeeCardSelector.module.css';

// ── Avatar helpers ────────────────────────────────────────────────────
const PALETTE = [
  '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
  '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
];

function avatarColor(id: string): string {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[n % PALETTE.length];
}

function initials(name: string, lastName: string): string {
  return `${name[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

// ── Component ─────────────────────────────────────────────────────────
interface EmployeeCardSelectorProps {
  employees:    Employee[];
  selectedId:   string;
  onChange:     (id: string) => void;
  showInactive?: boolean;
}

export function EmployeeCardSelector({
  employees,
  selectedId,
  onChange,
  showInactive = false,
}: EmployeeCardSelectorProps) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [query,       setQuery]       = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const displayList = showInactive
    ? employees
    : employees.filter((e) => e.status === 'ACTIVE');

  const filtered =
    query.length >= 3
      ? displayList.filter((e) => {
          const q = query.toLowerCase();
          return (
            e.name.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q)
          );
        })
      : displayList;

  const selected = employees.find((e) => e.id === selectedId);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  // Reset highlight when filtered list changes
  useEffect(() => { setHighlighted(0); }, [query]);

  function select(id: string) {
    onChange(id);
    setIsOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlighted]) select(filtered[highlighted].id);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>

      {/* ── Trigger card ─────────────────────────────────────────── */}
      <button
        className={styles.trigger}
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        {selected && (
          <>
            <div
              className={styles.avatar}
              style={{ background: avatarColor(selected.id) }}
            >
              {initials(selected.name, selected.lastName)}
            </div>
            <span className={styles.selectedName}>
              {selected.name} {selected.lastName}
            </span>
            {selected.status === 'INACTIVE' && (
              <span className={styles.inactiveBadge}>Inactive</span>
            )}
          </>
        )}
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className={styles.dropdown} role="dialog" aria-label="Select employee">

          {/* Search input */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}><SearchIcon /></span>
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Search employee by name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search employee"
            />
          </div>

          <div className={styles.divider} />

          {/* Employee list */}
          <ul className={styles.list} role="listbox">
            {filtered.length === 0 ? (
              <li className={styles.empty}>No employees found</li>
            ) : (
              filtered.map((emp, i) => (
                <li
                  key={emp.id}
                  className={[
                    styles.option,
                    i === highlighted          ? styles.optionHighlighted : '',
                    emp.id === selectedId      ? styles.optionSelected    : '',
                  ].join(' ')}
                  role="option"
                  aria-selected={emp.id === selectedId}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => select(emp.id)}
                >
                  <div
                    className={styles.optionAvatar}
                    style={{ background: avatarColor(emp.id) }}
                  >
                    {initials(emp.name, emp.lastName)}
                  </div>
                  <span className={styles.optionName}>
                    {emp.name} {emp.lastName}
                  </span>
                  {emp.status === 'INACTIVE' && (
                    <span className={styles.inactiveBadge}>Inactive</span>
                  )}
                  {emp.id === selectedId && (
                    <span className={styles.check}>✓</span>
                  )}
                </li>
              ))
            )}
          </ul>

          <div className={styles.divider} />

          {/* Keyboard hint */}
          <div className={styles.hint}>
            <span className={styles.hintIcon}><KeyboardIcon /></span>
            Type to search &nbsp;•&nbsp; ↑↓ to navigate &nbsp;•&nbsp; Enter to select
          </div>
        </div>
      )}
    </div>
  );
}
