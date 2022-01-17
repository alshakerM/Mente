import { PlayArrowRounded } from '@mui/icons-material';
import styles from './WhyMeditate.module.css';

export function WhyMeditate() {
  return (
    <div className={styles.contentContainer} id="why-meditate">
      <h1 className={styles.title}>Why Meditate?</h1>
      <p className={styles.reason}>
        Alan Watts, the British philosopher, writer, and speaker, makes a great
        concise case for mediation in this recording.
      </p>
      <div className={styles.iconsContainer}>
        <p className={styles.songText}>YO</p>
        <PlayArrowRounded className={styles.playIcon} />
      </div>
    </div>
  );
}
