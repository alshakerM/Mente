import Link from 'next/link';
import React from 'react';
import { useLessonsProgress } from '../../hooks';
import AllLessons from '../../public/med-data.json';
import styles from './ContinueListening.module.css';
import { PlayArrowRounded } from '@mui/icons-material';

export function ContinueListening() {
  const { lessonsProgress } = useLessonsProgress();
  const [active, setActive] = React.useState(true);

  const progressSorted = Object.entries(lessonsProgress).sort((a, b) => {
    return new Date(b[1].time).getTime() - new Date(a[1].time).getTime();
  });

  const lastListenedID = progressSorted?.[0]?.[0];

  React.useEffect(() => {
    setTimeout(setActive, 6000, false);
  }, []);

  // if no progress data is found, disable the widget forever,
  // to prevent it suddenly appearing when they play their first lesson
  React.useEffect(() => {
    if (!localStorage.getItem('progressV2')) {
      setActive(false);
    }
  }, []);

  if (!active || !lastListenedID) {
    return null;
  }

  const lesson = AllLessons.find((l) => l.id === lastListenedID);

  return (
    <div className={styles.contentContainer}>
      <PlayArrowRounded className={styles.play}></PlayArrowRounded>
      <Link shallow href={`?lessonId=${lesson?.id}`}>
        <a className={styles.link}>
          <h1 className={styles.continueText}>Continue Listening</h1>
          <p className={styles.title}>{lesson.title}</p>
        </a>
      </Link>
    </div>
  );
}
