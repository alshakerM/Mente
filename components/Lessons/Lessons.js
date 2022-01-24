import styles from './Lessons.module.css';
import AllLessons from '../../public/med-data.json';
import React from 'react';
import { Dropdown } from '../Dropdown/dropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFilters } from '../../hooks';
import cx from 'classnames';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';

const guides = AllLessons.map((data) => data.instructor);
const noDuplicatesGuide = Array.from(new Set(guides));
const types = AllLessons.map((data) => data.type);
const distinctTypes = Array.from(new Set(types));

export function Lessons() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { lessons, filters, addFilter } = useFilters(AllLessons);

  const openAudio = lessonId && lessons.find((med) => med.id === lessonId);

  return (
    <div className={styles.backgroundImgContainer}>
      <div className={styles.contentContainer}>
        <h1 id="lessons" className={styles.title}>
          Lessons
        </h1>
        <div className={styles.filtersSection}>
          <p className={styles.filterText}>Filters</p>
          <button
            onClick={() => addFilter('underFive', !filters.underFive.active)}
            className={cx(styles.filterOption, {
              [styles.isActive]: filters.underFive.active,
            })}
          >
            &lt; 5 minutes
          </button>
          <button className={styles.filterOption}>Already Listened</button>
          <button className={styles.filterOption}>Haven’t Listened</button>
          <div>
            <Dropdown
              options={noDuplicatesGuide}
              label="Filter By Guide"
              value={filters.byGuide.active && filters.byGuide.param}
              onChange={(instructor) => {
                addFilter('byGuide', instructor);
              }}
            />
          </div>
          <div>
            <Dropdown
              options={distinctTypes}
              value={filters.byType.active && filters.byType.param}
              onChange={(type) => {
                addFilter('byType', type);
              }}
              label="Filter By Type"
            />
          </div>
        </div>
        <ul className={styles.audioSection}>
          {lessons.map((lesson) => (
            <li
              className={styles.audioStatusContainer}
              key={lesson.mp3}
              style={
                lessonsProgress[lesson.id]
                  ? {
                      background: `linear-gradient(90deg, rgba(50, 164, 167, 0.5) ${
                        lessonsProgress[lesson.id] * 100
                      }%, #000000a5  0%)`,
                    }
                  : { background: '#0000009d' }
              }
            >
              <Link shallow href={`?lessonId=${lesson.id}`}>
                <a>
                  <div className={styles.songInfo}>
                    <p className={styles.songName}>{lesson.title}</p>
                    <p className={styles.timer}>
                      {convertTime(lesson.duration)} Min
                    </p>
                  </div>
                  <div className={styles.authorAndAlbum}>
                    <p className={styles.author}>{lesson.instructor}</p>
                    <p className={styles.album}>{lesson.type}</p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {lessonId && <AudioPlayer openAudio={openAudio} />}
    </div>
  );
}
