import { MethodMetadata, SlaeMethod } from '../core/types';
import styles from './MethodSelector.module.css';

interface MethodSelectorProps {
  methods: MethodMetadata[];
  selected: SlaeMethod;
  onChange: (method: SlaeMethod) => void;
}

export const MethodSelector = ({ methods, selected, onChange }: MethodSelectorProps) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="method-select">
        Method
      </label>
      <select
        id="method-select"
        className={styles.select}
        value={selected}
        onChange={(event) => onChange(event.target.value as SlaeMethod)}
      >
        {methods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.label}
          </option>
        ))}
      </select>
    </div>
  );
};
