import { GitHub, Twitter } from '@mui/icons-material';
import styles from './Credits.module.css';

export function Credits() {
  return (
    <div className={styles.contentContainer} id="credits">
      <h1 className={styles.title}>Mente</h1>
      <div className={styles.iconsContainer}>
        <a href="https://github.com/alshakerM/Mente" target="_blank" rel="noreferrer">
          <GitHub className={styles.gitHubIcon} />
        </a>
        <a
          href="https://twitter.com/m_alshaker"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className={styles.twitterIcon} />
        </a>
      </div>
      <p className={styles.creatorName}>© 2022 Marwan Alshaker</p>
    </div>
  );
}
