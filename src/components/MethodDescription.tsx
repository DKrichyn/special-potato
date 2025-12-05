import { MethodMetadata } from '../core/types';
import styles from './MethodDescription.module.css';

interface MethodDescriptionProps {
  method?: MethodMetadata;
}

export const MethodDescription = ({ method }: MethodDescriptionProps) => {
  if (!method) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{method.label}</h3>
      <p className={styles.text}>{method.description}</p>
    </div>
  );
};
