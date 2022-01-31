import React from 'react';
import { Captions } from './Captions';
import styles from './WhyMeditate.module.css';
import cx from 'classnames';
import { convertTime } from '../../utils';

const playbackRateNumbers = [1, 1.25, 1.5, 1.75, 2];

export function WhyMeditate() {
  const [pause, setPause] = React.useState(true);
  const [isPlayed, setIsPlayed] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [speedIndex, setSpeedIndex] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const audioRef = React.useRef();
  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    audioRef.current.playbackRate = playbackRateNumbers[speedIndex];
  }, [pause, speedIndex]);

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
          {isPlayed && (
            <circle
              r="122"
              cx="125"
              cy="125"
              className={styles.progress}
            ></circle>
          )}
          <circle
            r="118"
            cx="125"
            cy="125"
            fill="white"
            id="textCircle"
          ></circle>
          {isPlayed && (
            <text
              x="125"
              textAnchor="middle"
              y="30"
              fill="#a85a5d"
              fontSize="8px"
              fontFamily="courier"
            >
              {convertTime(291.664 - time)}
            </text>
          )}

          {!pause ? (
            <>
              <path
                transform="translate(26)"
                className={styles.playPauseButton}
                d="M94.4,200.9h-9.6c-0.7,0-1.2-0.5-1.2-1.2v-39c0-0.7,0.5-1.2,1.2-1.2h9.6c0.7,0,1.2,0.5,1.2,1.2v39
	C95.6,200.3,95.1,200.9,94.4,200.9z"
              />

              <path
                className={styles.playPauseButton}
                transform="translate(45)"
                d="M94.4,200.9h-9.6c-0.7,0-1.2-0.5-1.2-1.2v-39c0-0.7,0.5-1.2,1.2-1.2h9.6c0.7,0,1.2,0.5,1.2,1.2v39
	C95.6,200.3,95.1,200.9,94.4,200.9z"
              />
            </>
          ) : (
            <path
              className={styles.playPauseButton}
              transform={!isPlayed ? 'translate(7 -55)' : 'translate(7 0)'}
              d="M137.6,178.7l-29.2-18c-1.7-1-3.8,0.2-3.8,2.1v36c0,2,2.1,3.1,3.8,2.1l29.2-18
	C139.2,182,139.2,179.7,137.6,178.7z"
            />
          )}

          {isPlayed && <Captions time={time} />}
        </svg>
        {isPlayed && (
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
          preload="true"
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
          className={styles.audio}
          ref={audioRef}
        />
      </button>
    </div>
  );
}
