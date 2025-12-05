import styles from './ErrorAlert.module.css';

interface ErrorAlertProps {
  messages: string[];
}

export const ErrorAlert = ({ messages }: ErrorAlertProps) => {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={styles.alert} role="alert">
      <ul className={styles.list}>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
