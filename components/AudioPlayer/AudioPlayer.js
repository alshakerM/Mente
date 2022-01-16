import {
  Clear,
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

export function AudioPlayer({ openAudio }) {
  const [pause, setPause] = React.useState(true);
  const { lessonsProgress, updateLessonProgress } = useLessonsProgress();
  const [position, setPosition] = React.useState(0);
  const [progressPosition, setProgressPosition] = React.useState(0);
  const audioRef = React.useRef();
  const router = useRouter();
  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [pause]);

  return (
    <div
      className={styles.expandedContent}
      onKeyDown={(e) => {
        if (e.keyCode === 27) {
          router.push('/lessons', undefined, { shallow: true });
        }
      }}
    >
      <div className={styles.expandedHeader}>
        <p className={styles.expandedTitle}>LESSON</p>

        <Clear
          className={styles.expandedClearIcon}
          onClick={() => router.push('/lessons', undefined, { shallow: true })}
        />
      </div>
      <div className={styles.expandedBody}>
        <p className={styles.expandedSongName}>{openAudio.title}</p>
        <p className={styles.expandedSonAuthor}>{openAudio.instructor}</p>
      </div>
      <Slider
        sx={{ height: 15 }}
        value={progressPosition}
        min={0}
        step={1}
        max={openAudio.duration}
        onChange={(_, value) => setProgressPosition(value)}
        onClick={(event) => {
          const progressTime =
            (event.clientX / event.target.offsetWidth) * openAudio.duration -
            20;
          audioRef.current.currentTime = progressTime;
        }}
      />
      <div className={styles.expandedAudioSection}>
        <p>
          {convertTime(
            openAudio.duration * (lessonsProgress[openAudio.id] || 0)
          )}
        </p>

        <button className={styles.playButton} onClick={() => setPause(!pause)}>
          <PlayArrowRounded className={styles.playIcon} fontSize="large" />
        </button>
        <p>
          {convertTime(
            openAudio.duration * (1 - (lessonsProgress[openAudio.id] || 0))
          )}
        </p>

        <audio
          src={openAudio.mp3}
          ref={audioRef}
          onTimeUpdate={(event) => {
            updateLessonProgress(
              openAudio.id,
              event.currentTarget.currentTime / event.currentTarget.duration
            );
          }}
          muted={false}
        />
      </div>
      <div className={styles.volumeContainer}>
        {position < 50 ? (
          position === 0 ? (
            <VolumeOff />
          ) : (
            <VolumeDown />
          )
        ) : (
          <VolumeUp />
        )}

        <Slider
          style={{ width: 200, marginLeft: 15 }}
          size="small"
          value={position}
          min={0}
          step={1}
          onChange={(_, value) => {
            setPosition(value);
            audioRef.current.volume = position / 100;
          }}
        />
      </div>
    </div>
  );
}
