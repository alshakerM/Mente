import {
  Clear,
  Pause,
  PlayArrowRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import { convertTime } from '../../utils';
import { Slider } from '@mui/material';
import React from 'react';
import { useLessonsProgress } from '../../hooks';
import styles from './AudioPlayer.module.css';
import { useRouter } from 'next/router';
import cx from 'classnames';
import type { Lesson } from '../../types';

type AudioPlayerProps = {
  openAudio: Lesson;
};
export const AudioPlayer: React.FunctionComponent<AudioPlayerProps> = ({
  openAudio,
}) => {
  const [pause, setPause] = React.useState(false);
  const { lessonsProgress, updateLessonProgress } = useLessonsProgress();
  const [position, setPosition] = React.useState(0);
  const [progressPosition, setProgressPosition] = React.useState(0);
  const [seekActivated, setSeekActivated] = React.useState(false);

  const audioRef = React.useRef<HTMLAudioElement>();
  const router = useRouter();
  React.useEffect(() => {
    const volume = Number.parseFloat(localStorage.getItem('volume') || '50');
    setPosition(volume);
    audioRef.current.volume = volume / 100;
  }, []);

  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [pause]);
  React.useEffect(() => {
    if (seekActivated) {
      audioRef.current.currentTime = progressPosition;
      setSeekActivated(false);
    }
  }, [progressPosition, seekActivated]);
  React.useEffect(() => {
    if (
      lessonsProgress &&
      !isNaN(lessonsProgress[openAudio.id]?.progress * openAudio.duration)
    ) {
      audioRef.current.currentTime =
        lessonsProgress[openAudio.id]?.progress * openAudio.duration;
    }
  }, [audioRef.current]);

  const updateProgress = (currentTime) => {
    setProgressPosition(currentTime);
    updateLessonProgress(openAudio.id, currentTime / openAudio.duration);
  };

  return (
    <div
      className={styles.Content}
      onKeyDown={(e) => {
        if (e.keyCode === 27) {
          router.push('/', undefined, { shallow: true });
        }
      }}
    >
      <div className={styles.Header}>
        <p className={styles.title}>LESSON</p>

        <Clear
          className={styles.ClearIcon}
          onClick={() => router.push('/', undefined, { shallow: true })}
        />
      </div>
      <div className={styles.Body}>
        <p className={styles.SongName}>{openAudio.title}</p>
        <p className={styles.SonAuthor}>{openAudio.instructor}</p>
      </div>
      <div className={styles.playIconContainer}>
        <button className={styles.playButton} onClick={() => setPause(!pause)}>
          {pause ? (
            <PlayArrowRounded className={styles.playIcon} fontSize="large" />
          ) : (
            <Pause
              className={cx(styles.playIcon, { [styles.isPaused]: true })}
            />
          )}
        </button>
      </div>
      <div className={styles.audioTimers}>
        <p>
          {convertTime(
            openAudio.duration * (lessonsProgress[openAudio.id]?.progress || 0)
          )}
        </p>
        <p>
          {convertTime(
            openAudio.duration *
              (1 - (lessonsProgress[openAudio.id]?.progress || 0))
          )}
        </p>
      </div>
      <Slider
        sx={{ height: 15 }}
        value={progressPosition}
        min={0}
        step={1}
        max={openAudio.duration}
        onChange={(_, value) => {
          setSeekActivated(true);
          setProgressPosition(value as number);
        }}
      />
      <div className={styles.AudioSection}>
        <audio
          src={openAudio.mp3}
          ref={audioRef}
          onTimeUpdate={(event) => {
            updateProgress(event.currentTarget.currentTime);
          }}
        />
        <div className={styles.AudioSection}>
          <audio
            src={openAudio.mp3}
            ref={audioRef}
            onTimeUpdate={(event) => {
              updateProgress(event.currentTarget.currentTime);
            }}
            muted={false}
          />
        </div>
        <div className={styles.volumeContainer}>
          {position < 50 ? (
            position === 0 ? (
              <button
                className={styles.iconButton}
                onClick={() =>
                  setPosition(Number.parseFloat(localStorage.getItem('volume')))
                }
              >
                <VolumeOff />
              </button>
            ) : (
              <button
                onClick={() => setPosition(0)}
                className={styles.iconButton}
              >
                <VolumeDown />
              </button>
            )
          ) : (
            <button
              onClick={() => setPosition(0)}
              className={styles.iconButton}
            >
              <VolumeUp />
            </button>
          )}

          <Slider
            style={{ width: 200, marginLeft: 15 }}
            size="small"
            value={position}
            min={0}
            step={1}
            onChange={(_, value) => {
              if (typeof value === 'number') {
                setPosition(value);
                localStorage.setItem('volume', value.toString());
                audioRef.current.volume = value / 100;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
