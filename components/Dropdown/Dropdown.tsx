import styles from './Dropdown.module.css';

type DropdownProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
};

export const Dropdown: React.FunctionComponent<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <select
      className={styles.dropdown}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
