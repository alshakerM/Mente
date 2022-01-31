import styles from './Dropdown.module.css';

export function Dropdown({ options, value, onChange, label }) {
  return (
    <select
      className={styles.dropdown}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option} className={styles.dropdownOptions}>
          {option}
        </option>
      ))}
    </select>
  );
}
