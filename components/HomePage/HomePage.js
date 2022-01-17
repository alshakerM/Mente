import Link from 'next/link';
import styles from './HomePage.module.css';
import Image from 'next/image';
import { Lessons } from '../Lessons/Lessons';
import { Credits } from '../Credits/Credits';

export function HomePage() {
  return (
    <>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Mente</h1>
          <p className={styles.appInfo}>Free Meditation App</p>
        </div>
        <div className={styles.body}>
          <a className={styles.lessonsLink} href="#lessons">
            Lessons
          </a>

          <Link href="/">
            <a className={styles.reasonLink}>Why Meditate</a>
          </Link>
          <Link href="/">
            <a className={styles.codeLink}>Source Code</a>
          </Link>

          <a className={styles.creditsLink} href="#credits">
            Credits
          </a>
        </div>
        <div className={styles.footer}>
          <p>All Audio Material Provided By</p>
          <div className={styles.imgsContainer}>
            <Image
              src="/UCLA_White.png"
              width={218}
              height={40}
              alt="UCLA logo"
            />
            <Image
              src="/UCSanDiegoLogo-White.png"
              width={211}
              height={40}
              alt="UCSanD logo"
            />
          </div>
        </div>
      </div>

      <Lessons />
      <Credits />
    </>
  );
}
