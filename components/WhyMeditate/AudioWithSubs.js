import React from 'react';
import subs from './subs.json'
import styles from './AudioWithSubs.module.css';

function findSegments(ms) {
  const segments = subs.filter(
    (s) => s.startMs > 0 && s.startMs < ms && s.startMs + s.duration > ms
  );
  return segments.map((segment) => {
    const segmentStart = segment.startMs;
    const wordOffset = ms - segmentStart;

    return {
      parts: segment.parts
        ?.filter((s) => (s.delay || 0) <= wordOffset)
        .map((part) => part.phrase),
      key: segment.key,
    };
  });
}

export function AudioWithSubs({ pause, setCurrentProgress }) {
  const audioRef = React.useRef();
  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [pause]);
  const [time, setTime] = React.useState(0);
  return (
    <div className={styles.audioContainer}>
      <audio
        onTimeUpdate={(e) => {
          setCurrentProgress(
            e.currentTarget.currentTime / e.currentTarget.duration
          );
          setTime(e.currentTarget.currentTime);
        }}
        src="/sound.mp3"
        style={{ width: 500 }}
        className={styles.audio}
        ref={audioRef}
      />
      {findSegments(time * 1000).map((segment) => (
        <p key={segment.key} className={styles.phrase}>
          {segment.parts.map((word) => (
            <span key={word} className={styles.word}>
              {word}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
