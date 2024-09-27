import { GitHub, Twitter } from '@mui/icons-material';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.title}>Samara&#39;s Gift</h1>
      <p className={styles.creatorName}>
        © {new Date().getFullYear()} Marwan Alshaker
      </p>
    </div>
  );
};
