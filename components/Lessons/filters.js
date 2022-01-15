const array = [
  {
    instructor: 'Sam Harris',
    duration: 300,
  },
  {
    instructor: 'Sam Douglas',
    duration: 3001,
  },
];

function underFive(item) {
  return item.duration / 60 < 5;
}

function byGuide(item, guide) {
  return item.guide === guide;
}

/*
    [under 5] [by guide]
*/

const activeFilters = [
  {
    filterFunction: 'byGuide',
    params: 'Sam Harris',
  },
];

const filterFunctions = {
  byGuide,
  underFive,
};

let newArray = data;

activeFilters.forEach((filter) => {
  const filterKey = filter.filterFunction;
  const filterFunction = filterFunctions[filterKey];
  const param = filter.params;

  data.filter((item) => filterFunction(item, param));
});
