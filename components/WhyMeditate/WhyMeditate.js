import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import React from 'react';
import { AudioWithSubs } from './AudioWithSubs';
import styles from './WhyMeditate.module.css';
import cx from 'classnames';

const playbackRateNumbers = [1, 1.25, 1.5, 1.75, 2];
export function WhyMeditate() {
  const [pause, setPause] = React.useState(true);
  const [isPlayed, setIsPlayed] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [speedIndex, setSpeedIndex] = React.useState(0);

  const audioRef = React.useRef();
  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    audioRef.current.playbackRate = playbackRateNumbers[speedIndex];
  }, [pause, speedIndex]);
  const [time, setTime] = React.useState(0);

  return (
    <div className={styles.contentContainer} id="why-meditate">
      <h1 className={styles.title}>Why Meditate?</h1>
      <p className={styles.reason}>
        Alan Watts, the British philosopher, writer, and speaker, makes a great
        concise case for mediation in this recording.
      </p>
      <button
        className={cx(styles.playerContainer, { [styles.isPlayed]: isPlayed })}
        onClick={() => {
          if (!isPlayed) {
            setIsPlayed(true);
          }
          setPause(!pause);
        }}
      >
        <svg
          viewBox="0 0 250 250"
          className={cx(styles.svg, { [styles.isPlayed]: isPlayed })}
          style={{ '--currentProgress': currentProgress }}
        >
          <clipPath id="outerCircle">
            <circle r="118" cx="125" cy="125"></circle>
          </clipPath>
          <circle
            r="122"
            cx="125"
            cy="125"
            className={styles.progress}
          ></circle>
          <circle
            r="118"
            cx="125"
            cy="125"
            fill="white"
            id="textCircle"
          ></circle>

          {!pause ? (
            <>
              <rect
                className={styles.playPauseButton}
                fill="#a85a5d"
                x="111.31"
                y="161.64"
                width="12.42"
                height="42.42"
              />
              <rect
                className={styles.playPauseButton}
                fill="#a85a5d"
                x="130.43"
                y="161.64"
                width="12.42"
                height="42.42"
              />
            </>
          ) : (
            <polygon
              className={styles.playPauseButton}
              transform={!isPlayed && 'translate(0 -50)'}
              points="157.66 181.33 106.76 151.95 106.76 210.72 157.66 181.33"
              fill="#a85a5d"
            />
          )}

          {isPlayed && (
            <>
              <AudioWithSubs time={time} />
            </>
          )}
        </svg>
        {isPlayed && !pause && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSpeedIndex((speedIndex + 1) % playbackRateNumbers.length);
            }}
            className={styles.speedButton}
          >
            ×{playbackRateNumbers[speedIndex]}
          </button>
        )}

        <audio
          onTimeUpdate={(e) => {
            const progress =
              e.currentTarget.currentTime / e.currentTarget.duration;
            setCurrentProgress(progress);
            if (progress === 1) {
              setPause(true);
              setIsPlayed(false);
            }
            setTime(e.currentTarget.currentTime);
          }}
          src="/sound.mp3"
          style={{ width: 500 }}
          className={styles.audio}
          ref={audioRef}
        />
      </button>
    </div>
  );
}
