import styles from './Lessons.module.css';
import Image from 'next/image';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import medData from '../../public/med-data.json';
import React from 'react';
import cx from 'classnames';

export function Lessons() {
  const audioData = medData.map((data) => data.mp3);
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
  const [activeAudio, setActiveAudio] = React.useState(undefined);
  console.log({ activeAudio });
  const mins = '< 5 minutes';
  /* const expandAudio = React.useCallback(
    function expandAudio() {
      setIsExpanded(audioData);
    },
    [audioData, setIsExpanded]
  ); */
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
              onClick={() => setActiveAudio(data.mp3)}
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
    </div>
  );
}
