import type { InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = '', id, ...rest }: CheckboxProps) {
  return (
    <label className={`${styles.wrapper} ${className}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        {...rest}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
