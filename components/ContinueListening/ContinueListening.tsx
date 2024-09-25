import Link from 'next/link';
import React from 'react';
import { getAllData, useLessonsProgress } from '../../hooks';
import styles from './ContinueListening.module.css';
import { PlayArrowRounded } from '@mui/icons-material';

type ContinueListeningProps = {
  defaultVisible: Boolean;
};

export const ContinueListening: React.FC<ContinueListeningProps> = ({
  defaultVisible,
}) => {
  const { chapters } = getAllData();
  const { lessonsProgress } = useLessonsProgress();
  const [active, setActive] = React.useState(defaultVisible);

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
  React.useEffect(() => {
    if (!defaultVisible) {
      setActive(false);
    }
  }, [defaultVisible]);

  if (!active || !lastListenedID) {
    return null;
  }

  const lesson = chapters.find((l) => l.id === parseInt(lastListenedID));

  return (
    <Link shallow href={`?lessonId=${lesson?.id}`}>
      <a className={styles.contentContainer}>
        <PlayArrowRounded className={styles.play}></PlayArrowRounded>
        <div className={styles.link}>
          <h1 className={styles.continueText}>Continue Listening</h1>
          <p className={styles.title}>{lesson?.nameSimple}</p>
        </div>
      </a>
    </Link>
  );
};
