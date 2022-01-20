import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import React from 'react';
import { AudioWithSubs } from './AudioWithSubs';
import styles from './WhyMeditate.module.css';
import cx from 'classnames';

export function WhyMeditate() {
  const [pause, setPause] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  console.log(currentProgress);
  return (
    <div className={styles.contentContainer} id="why-meditate">
      <h1 className={styles.title}>Why Meditate?</h1>
      <p className={styles.reason}>
        Alan Watts, the British philosopher, writer, and speaker, makes a great
        concise case for mediation in this recording.
      </p>
      <div
        className={cx(styles.playerContainer, { [styles.isPlayed]: !pause })}
      >
        <svg
          viewBox="0 0 250 250"
          className={cx(styles.svg, { [styles.isPlayed]: !pause })}
          style={{ '--currentProgress': currentProgress }}
        >
          <circle
            r="122"
            cx="120"
            cy="120"
            className={styles.progress}
          ></circle>
        </svg>

        <div
          className={cx(styles.audioContainer, { [styles.isPlayed]: !pause })}
        >
          {!pause && (
            <>
              <AudioWithSubs
                pause={pause}
                setCurrentProgress={setCurrentProgress}
              />
            </>
          )}
          <button
            onClick={() => setPause(!pause)}
            className={styles.playPauseIconContainer}
          >
            {pause ? (
              <PlayArrowRounded className={styles.playIcon} />
            ) : (
              <PauseRounded className={styles.pauseIcon} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
