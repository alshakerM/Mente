import styles from './HomePage.module.css';
import { Lessons } from '../Lessons/Lessons';
import { Footer } from '../Footer/Footer';
import React, { useEffect } from 'react';
import { ContinueListening } from '../ContinueListening/ContinueListening';
import { useRouter } from 'next/router';
import { usePrayTime } from '../../hooks';
import { useNotification } from '../../notifyHooks';

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { prayData, currentTime } = usePrayTime();
  const { sendNotificationButtonOnClick } = useNotification();

  useEffect(() => {
    if (prayData) {
      const isPrayTime = prayData.items.some(
        (item) => item.asr === currentTime.toLocaleLowerCase()
      );
      if (currentTime === '05:47 PM' || isPrayTime) {
        console.log('DDDD', currentTime);
        sendNotificationButtonOnClick();
      }
    }
  }, [currentTime]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.background}>
          <img className={styles.img} src="/image.jpg" />
        </div>
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
