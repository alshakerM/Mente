import React, { useEffect, useState } from 'react';
import { quran } from '@quranjs/api';
import type { Lesson } from './types';

function byGuide(item: Lesson, name: Lesson['nameSimple']) {
  return item.nameSimple === name;
}

const filterFunctions = {
  byGuide,
} as const;

type FilterState = {
  byGuide: {
    params?: string;
    active: boolean;
  };
};
export function getAllData() {
  const [chapters, setChapters] = useState([]);
  const [audio, setAudio] = useState([]);

  useEffect(() => {
    quran.v4.chapters.findAll().then(setChapters);
    quran.v4.audio.findAllChapterRecitations('3').then(setAudio);
  }, []);
  chapters.forEach((chapter) => {
    const audioData = audio.find((clip) => clip.chapterId === chapter.id);
    chapter['audioLink'] = audioData?.audioUrl;
  });

  return { chapters };
}
export function useFilters(lessons: Array<Lesson>) {
  const [filtersState, setFiltersState] = React.useState<FilterState>({
    byGuide: {
      params: undefined,
      active: false,
    },
  });

  /**
   *
   * @param key the filter's function name (key)
   * @param param the predicate
   */
  function addFilter(
    key: keyof typeof filterFunctions,
    active: boolean,
    params?: string
  ) {
    const newFiltersState: FilterState = { ...filtersState };

    newFiltersState[key] = {
      active,
      params,
    };

    setFiltersState(newFiltersState);
  }

  let filteredLessons = lessons;

  for (const [key, filter] of Object.entries(filtersState)) {
    if (filter.active) {
      const filterFunction = filterFunctions[key];
      filteredLessons = filteredLessons.filter((item) =>
        filterFunction(item, filter.params)
      );
    }
  }
  return { lessons: filteredLessons, filters: filtersState, addFilter };
}

const subscribers = new Set<React.Dispatch<React.SetStateAction<{}>>>();

export function useLessonsProgress() {
  const [lessonsProgress, setProgress] = React.useState<
    Record<Lesson['id'], { progress: number; time: string }>
  >({});

  React.useEffect(() => {
    const storedProgress = localStorage.getItem('progressV2');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  React.useEffect(() => {
    subscribers.add(setProgress);
    return () => {
      subscribers.delete(setProgress);
    };
  }, [setProgress]);

  function updateLessonProgress(lessonId: Lesson['id'], progress: number) {
    const newState = { ...lessonsProgress };
    newState[lessonId] = { progress, time: new Date().toISOString() };
    localStorage.setItem('progressV2', JSON.stringify(newState));
    subscribers.forEach((callback) => callback(newState));
  }

  return {
    lessonsProgress,
    updateLessonProgress,
  };
}

export function getPrayTime() {
  const [prayData, setData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    fetch('/api/prayerTimes')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching the data:', error);
      });
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);
  return { prayData, currentTime };
}
