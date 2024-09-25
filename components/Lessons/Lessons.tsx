import styles from './Lessons.module.css';

import React, { useState } from 'react';
import { Dropdown } from '../Dropdown/Dropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getAllData, useFilters } from '../../hooks';

import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import { useLessonsProgress } from '../../hooks';
import { convertTime } from '../../utils';

const usehandleDuration = () => {
  const [durations, setDurations] = useState({});
  const handleMetadataLoaded = (lessonId, duration) => {
    setDurations((prevDurations) => ({
      ...prevDurations,
      [lessonId]: duration,
    }));
  };
  return { durations, handleMetadataLoaded };
};

export function Lessons() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { lessonsProgress } = useLessonsProgress();
  const { chapters } = getAllData();
  const { lessons, filters, addFilter } = useFilters(chapters);

  const openAudio =
    lessonId && lessons.find((med) => med.id === parseInt(lessonId as string));
  const guides = chapters.map((data) => data.nameSimple);
  const { durations, handleMetadataLoaded } = usehandleDuration();
  return (
    <>
      <div className={styles.contentContainer}>
        <h1 id="lessons" className={styles.title}>
          Surahs
        </h1>
        <div className={styles.filtersSection}>
          <div>
            <Dropdown
              options={guides}
              label="Filter By Name"
              value={filters.byGuide.active && filters.byGuide.params}
              onChange={(instructor) => {
                addFilter('byGuide', !!instructor, instructor);
              }}
            />
          </div>
        </div>
        <ul className={styles.audioSection}>
          {lessons.map((lesson) => (
            <li
              className={styles.audioStatusContainer}
              key={lesson.id}
              style={
                lessonsProgress[lesson.id]
                  ? {
                      background: `linear-gradient(90deg, rgba(50, 164, 167, 0.5) ${
                        lessonsProgress[lesson.id].progress * 100
                      }%, #000000a5  0%)`,
                    }
                  : { background: '#0000009d' }
              }
            >
              <Link shallow href={`?lessonId=${lesson.id}`}>
                <a>
                  <div className={styles.songInfo}>
                    <p className={styles.songName}>{lesson.nameSimple}</p>
                    <p className={styles.timer}>
                      {convertTime(durations[lesson.id])}
                    </p>
                  </div>
                  <div className={styles.authorAndAlbum}>
                    <p className={styles.author}>{lesson.nameSimple}</p>
                    <p className={styles.album}>{lesson.nameSimple}</p>
                  </div>
                </a>
              </Link>
              <div hidden>
                <audio
                  src={lesson.audioLink}
                  onLoadedMetadata={(e) =>
                    handleMetadataLoaded(
                      lesson.id,
                      (e.target as HTMLAudioElement).duration
                    )
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      {lessonId && (
        <AudioPlayer
          openAudio={openAudio}
          duration={durations[lessonId as string]}
        />
      )}
    </>
  );
}
