import React from 'react';
import subs from './subs.json';
import styles from './Captions.module.css';
import cx from 'classnames';

function findSegments(ms) {
  const segments = subs.filter(
    (s) => s.startMs > 0 && s.startMs < ms && s.startMs + s.duration > ms
  );
  return segments.map((segment) => {
    const segmentStart = segment.startMs;
    const wordOffset = ms - segmentStart;

    return {
      parts: segment.parts
        ?.filter((s) => (s.delay || 0) <= wordOffset)
        .map((part) => part.phrase),
      key: segment.key,
    };
  });
}

export function Captions({ time }) {
  const specialWords = [
    'reality',
    'confuse',
    'meditation',
    'world',
    'symbols',
    'minds',
    'wealth',
    'images',
    'dangerous',
    'myself',
    'think',
    'madness',
    'compulsively',
  ];

  return findSegments(time * 1000).map((segment, index) => {
    const allWords = segment.parts.reduce((words, word) => (words += word), '');
    return (
      <text
        textAnchor="middle"
        key={segment.key}
        className={styles.phrase}
        x="125"
        y={80 + index * 15}
      >
        {segment.parts.map((word) => (
          <tspan
            key={word}
            className={cx(styles.word, {
              [styles.isSpecial]: specialWords.includes(word.trim()),
            })}
          >
            {word}
          </tspan>
        ))}
      </text>
    );
  });
}
