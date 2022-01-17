import styles from './Lessons.module.css';
import AllLessons from '../../public/med-data.json';
import React from 'react';
import {
  Clear,
  PlayArrowRounded,
  VolumeDown,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import { Dropdown } from '../Dropdown/dropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFilters, useLessonsProgress } from '../../hooks';
import cx from 'classnames';
import { convertTime } from '../../utils';
import { Slider } from '@mui/material';

const guides = AllLessons.map((data) => data.instructor);
const noDuplicatesGuide = Array.from(new Set(guides));
const types = AllLessons.map((data) => data.type);
const distinctTypes = Array.from(new Set(types));

export function Lessons() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { lessons, filters, addFilter } = useFilters(AllLessons);
  const { lessonsProgress, updateLessonProgress } = useLessonsProgress();
  const openAudio = lessonId && lessons.find((med) => med.id === lessonId);
  const [pause, setPause] = React.useState(true);
  const [position, setPosition] = React.useState(0);
  const audioRef = React.useRef();

  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [pause]);

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
            <li className={styles.audioStatusContainer} key={lesson.mp3}>
              <Link shallow href={`?lessonId=${lesson.id}`}>
                <a>
                  <div className={styles.songInfo}>
                    <p className={styles.songName}>{lesson.title}</p>
                    <p className={styles.timer}>
                      {(lesson.duration / 60).toFixed(1)} Min
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
      {lessonId && (
        <div className={styles.expandedContent}>
          <div className={styles.expandedHeader}>
            <p className={styles.expandedTitle}>LESSON</p>
            <Clear
              className={styles.expandedClearIcon}
              onClick={() =>
                router.push('/', undefined, { shallow: true })
              }
            />
          </div>
          <div className={styles.expandedBody}>
            <p className={styles.expandedSongName}>{openAudio.title}</p>
            <p className={styles.expandedSonAuthor}>{openAudio.instructor}</p>
          </div>
          <div
            className={styles.progressBar}
            onClick={(event) => {
              const progressTime =
                (event.clientX / event.target.offsetWidth) *
                  openAudio.duration -
                11;
              audioRef.current.currentTime = progressTime;
            }}
          >
            <div
              className={styles.expandedProgressBar}
              style={{ width: `${lessonsProgress[openAudio.id] * 100}%` }}
            ></div>
          </div>
          <div className={styles.expandedAudioSection}>
            <p>
              {convertTime(
                openAudio.duration * (lessonsProgress[openAudio.id] || 0)
              )}
            </p>

            <button
              className={styles.playButton}
              onClick={() => setPause(!pause)}
            >
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
              aria-label="time-indicator"
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
      )}
    </div>
  );
}
