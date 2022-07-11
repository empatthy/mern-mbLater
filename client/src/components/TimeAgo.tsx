import React from 'react';
import { parseISO, formatDistanceToNow } from 'date-fns';

interface TimeAgoProp {
  date: string;
}

export const getDateNowISO = () => {
  const d = new Date().toISOString();
  return d;
};

export function TimeAgo(prop: TimeAgoProp) {
  let timeAgo = '';
  if (prop.date) {
    const date = parseISO(prop.date);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }

  return <p className="fw-lighter fs-date mb-1 text-light">{timeAgo}</p>;
}
