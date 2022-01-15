export function convertTime(seconds) {
  return new Date(seconds * 1000).toISOString().substring(11, 19);
}
