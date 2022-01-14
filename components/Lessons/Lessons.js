import styles from './Lessons.module.css';
import Image from 'next/image';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import medData from '../../public/med-data.json';
import React from 'react';
import cx from 'classnames';
import {
  Clear,
  PlayArrowRounded,
  PlayCircleOutline,
  PlayCircleRounded,
} from '@mui/icons-material';
import { style } from '@mui/system';

export function Lessons() {
  const [activeAudio, setActiveAudio] = React.useState(undefined);
  const openAudio = medData.find((med) => med.mp3 === activeAudio);
  const guide = medData.map((data) => data.instructor);
  const noDuplicatesGuide = guide.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });
  const type = medData.map((data) => data.type);
  const noDuplicatesType = type.filter(function (value, index, array) {
    return array.indexOf(value) === index;
  });
  const [isGuideDropped, setIsGuideDropped] = React.useState(false);
  const [isTypeDropped, setIsTypeDropped] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [currentAudioTime, setCurrentAudioTime] = React.useState(0);
  const [audioTimeLeft, setAudioTimeLeft] = React.useState(0);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [pause, setPause] = React.useState(true);
  const audioRef = React.useRef();
  React.useEffect(() => {
    if (pause) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [pause]);
  const mins = '< 5 minutes';
  if (activeAudio && isExpanded) {
  }
  return (
    <div>
      <div className={styles.backgroundImgContainer}>
        <Image
          src="/tree-background.png"
          layout="fill"
          alt="background trees"
        />
      </div>
      <div className={styles.contentContainer}>
        <p className={styles.title}>Lessons</p>
        <div className={styles.filtersSection}>
          <p className={styles.filterText}>Filters</p>
          <button className={styles.filterOption}>{mins}</button>
          <button className={styles.filterOption}>Already Listened</button>
          <button className={styles.filterOption}>Haven’t Listened</button>
          <div>
            <button className={styles.filterOption}>
              <span>Filter By Guide </span>
              <ArrowDropDownIcon
                onClick={() => setIsGuideDropped(!isGuideDropped)}
                className={styles.dropdownIcon}
                fontSize="large"
              />
            </button>
            <div
              className={cx(styles.guideNames, {
                [styles.isVisible]: isGuideDropped,
              })}
            >
              {noDuplicatesGuide.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </div>
          </div>
          <div>
            <button className={styles.filterOption}>
              <span>Filter By Type </span>
              <ArrowDropDownIcon
                onClick={() => setIsTypeDropped(!isTypeDropped)}
                className={styles.dropdownIcon}
                fontSize="large"
              />
            </button>
            <div
              className={cx(styles.types, {
                [styles.isVisible]: isTypeDropped,
              })}
            >
              {noDuplicatesType.map((type) => (
                <ul className={styles.typeList} key={type}>
                  <li>{type}</li>
                </ul>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.audioSection}>
          {medData.map((data) => (
            <div
              className={styles.audioStatusContainer}
              key={data.mp3}
              onClick={() => {
                setIsExpanded(true);
                setActiveAudio(data.mp3);
              }}
            >
              <div className={styles.songInfo}>
                <p className={styles.songName}>{data.title}</p>
                <p className={styles.timer}>
                  {(data.duration / 60).toFixed(1)} Min
                </p>
              </div>
              <div className={styles.authorAndAlbum}>
                <p className={styles.author}>{data.instructor}</p>
                <p className={styles.album}>{data.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeAudio && isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.expandedHeader}>
            <p className={styles.expandedTitle}>LESSON</p>
            <Clear
              className={styles.expandedClearIcon}
              onClick={() => setIsExpanded(false)}
            />
          </div>
          <div className={styles.expandedBody}>
            <p className={styles.expandedSongName}>{openAudio.title}</p>
            <p className={styles.expandedSonAuthor}>{openAudio.instructor}</p>
          </div>
          <div className={styles.expandedAudioSection}>
            <p>
              {currentAudioTime < 60
                ? `00:${
                    currentAudioTime <= 10
                      ? `0${currentAudioTime.toFixed(0)}`
                      : currentAudioTime.toFixed(0)
                  }`
                : `0${(currentAudioTime / 60).toFixed(2)}`}
            </p>

            <button
              className={styles.playButton}
              onClick={() => setPause(!pause)}
            >
              <PlayArrowRounded className={styles.playIcon} fontSize="large" />
            </button>
            <p className={styles.expandedTimeLeft}>
              {audioTimeLeft === 0
                ? (openAudio.duration / 60).toFixed(2)
                : `0${(audioTimeLeft / 60).toFixed(2)}`}
            </p>
            <audio
              src={openAudio.mp3}
              ref={audioRef}
              onTimeUpdate={(event) => {
                setAudioTimeLeft(event.target.duration);
                setCurrentAudioTime(event.target.currentTime);
                setCurrentProgress(
                  event.target.currentTime / event.target.duration
                );
              }}
              muted={false}
            />
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.expandedProgressBar}
              style={{ width: `${currentProgress * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
