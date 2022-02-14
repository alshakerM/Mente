export type Lesson = {
  id: string;
  date: string;
  title: string;
  instructor: string;
  mp3: string;
  type: string;
  /**
   * The lesson's duration
   */
  duration: number;
};
