import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.title}>Samar&#39;s prayer reminder</h1>

      <p className={styles.creatorName}>
        © {new Date().getFullYear()} Marwan Alshaker
      </p>
    </div>
  );
};
