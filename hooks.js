import React from 'react';

function underFive(item) {
  return item.duration / 60 < 5;
}

function byGuide(item, guide) {
  return item.instructor === guide;
}

function byType(item, type) {
  return item.type === type;
}

const filterFunctions = {
  byGuide,
  underFive,
  byType,
};

export function useFilters(lessons) {
  const [filtersState, setFiltersState] = React.useState({
    underFive: {
      active: false,
    },
    byGuide: {
      params: undefined,
      active: false,
    },
    byType: {
      params: undefined,
      active: false,
    },
  });

  /**
   *
   * @param {underFive|byGuide|byType} key the filter's function name (key)
   * @param {string|number} param the predicate
   */
  function addFilter(key, param = -1) {
    const newFiltersState = { ...filtersState };
    newFiltersState[key] = {
      // if param is -1, it means the user didn't pass a param (for filters without a param like <5)
      // else of param is falsy, it means they want to deactivate the filter.
      active: param === -1 ? true : !!param,
      param,
    };
    setFiltersState(newFiltersState);
  }

  let filteredLessons = lessons;

  for (const [key, filter] of Object.entries(filtersState)) {
    if (filter.active) {
      const filterFunction = filterFunctions[key];
      filteredLessons = filteredLessons.filter((item) =>
        filterFunction(item, filter.param)
      );
    }
  }

  return { lessons: filteredLessons, filters: filtersState, addFilter };
}

const subscribers = new Set();

export function useLessonsProgress() {
  const [lessonsProgress, setProgress] = React.useState({});

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

  function updateLessonProgress(lessonId, progress) {
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

/**
 *
 * @param {audio element} the audio element playbackRate.
 * @param {numbers} speed numbers e.g(1, 1.25, 1.5, 1.75, 2)
 * @param {index} which number
 * @returns how fast you want the audio element to be e.g(1, 1.25, 1.5, 1.75, 2)
 */

export function playbackRate(audioPlaybackRate, numbers, index) {
  return (audioPlaybackRate = numbers[index]);
}
