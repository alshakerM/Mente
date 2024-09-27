import styles from './HomePage.module.css';
import { Lessons } from '../Lessons/Lessons';
import { Footer } from '../Footer/Footer';
import React, { useEffect, useRef, useState } from 'react';
import { ContinueListening } from '../ContinueListening/ContinueListening';
import { useRouter } from 'next/router';
import { usePrayTime } from '../../hooks';
import { useNotification } from '../../notifyHooks';

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { prayData, currentTime } = usePrayTime();
  const { sendNotificationButtonOnClick } = useNotification();
  const audioRef = useRef(null);
  const [showAudio, setShowAudio] = useState(true);

  useEffect(() => {
    if (prayData) {
      Object.values(prayData).includes(currentTime.toLocaleLowerCase());
      const isPrayTime = prayData.items.some((item) =>
        Object.values(item).includes(currentTime.toLocaleLowerCase())
      );
      if (currentTime === '05:30 PM' || isPrayTime) {
        sendNotificationButtonOnClick();
        if (Notification.permission === 'granted') {
          const audio = new Audio('/sound.mp3');
          audio.play();
        }
      }
    }
  }, [currentTime, prayData]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.background}>
          <img className={styles.img} src="/image.jpg" />
        </div>

        <audio
          src="/sound.mp3"
          autoPlay
          controls={showAudio}
          ref={audioRef}
          onPause={() => setShowAudio(false)}
          className={styles.audio}
        />

        {prayData ? (
          <div className={styles.times}>
            <h2>
              {prayData.title} {prayData.items[0].date_for}
            </h2>
            <p>Fajr: {prayData.items[0].fajr}</p>

            <p>Dhuhr: {prayData.items[0].dhuhr}</p>
            <p>Asr: {prayData.items[0].asr}</p>
            <p>Maghrib: {prayData.items[0].maghrib}</p>
            <p>Isha: {prayData.items[0].isha}</p>
          </div>
        ) : (
          <div className={styles.times}>
            <h2 className={styles.loading}>Ostend, Belgium</h2>
            <p className={styles.loading}>Fajr: 5:30 </p>
            <p className={styles.loading}>Dhuhr: 5:30 </p>
            <p className={styles.loading}>Asr: 5:30 </p>
            <p className={styles.loading}>Maghrib: 5:30 </p>
            <p className={styles.loading}>Isha: 5:30 </p>
          </div>
        )}
        <Lessons />
        <Footer />
        <ContinueListening defaultVisible={router.asPath === '/'} />
      </div>
    </>
  );
};
