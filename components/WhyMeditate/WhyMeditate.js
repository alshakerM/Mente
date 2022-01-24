import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import React from 'react';
import { AudioWithSubs } from './AudioWithSubs';
import styles from './WhyMeditate.module.css';
import cx from 'classnames';

export function WhyMeditate() {
  const [pause, setPause] = React.useState(true);
  const [isPlayed, setIsPlayed] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  return (
    <div className={styles.contentContainer} id="why-meditate">
      <h1 className={styles.title}>Why Meditate?</h1>
      <p className={styles.reason}>
        Alan Watts, the British philosopher, writer, and speaker, makes a great
        concise case for mediation in this recording.
      </p>
      <div
        className={cx(styles.playerContainer, { [styles.isPlayed]: isPlayed })}
      >
        <svg
          viewBox="0 0 250 250"
          className={cx(styles.svg, { [styles.isPlayed]: isPlayed })}
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
          className={cx(styles.audioContainer, { [styles.isPlayed]: isPlayed })}
        >
          {isPlayed && (
            <>
              <AudioWithSubs
                pause={pause}
                setCurrentProgress={setCurrentProgress}
              />
            </>
          )}
          <button
            onClick={() => {
              if (!isPlayed) {
                setIsPlayed(true);
              }
              setPause(!pause);
            }}
            className={styles.playPauseIconContainer}
          >
            {pause ? (
              <PlayArrowRounded
                className={cx(styles.playIcon, { [styles.isPlayed]: isPlayed })}
              />
            ) : (
              <PauseRounded className={styles.pauseIcon} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
