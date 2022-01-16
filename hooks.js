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

export function useLessonsProgress() {
  const [lessonsProgress, setProgress] = React.useState({});

  React.useEffect(() => {
    const storedProgress = localStorage.getItem('progress');
    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  function updateLessonProgress(lessonId, progress) {
    const newState = { ...progress };
    newState[lessonId] = progress;
    setProgress(newState);
    localStorage.setItem('progress', JSON.stringify(newState));
  }
  return { lessonsProgress, updateLessonProgress };
}