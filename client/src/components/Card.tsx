import React from 'react';
import { parseISO, formatDistanceToNow } from 'date-fns';

interface CardProp {
  id: string;
  title: string;
  description: string;
  author: any;
  date: string;
  likes: number;
  dislikes: number;
  key?: any;
}

export function Card(prop: CardProp) {
  let timeAgo = '';
  if (prop.date) {
    const date = parseISO(prop.date);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }

  return (
    <div
      className="card my-3 me-3 rounded-0 border-secondary text-light"
      style={{ width: '24rem' }}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body bg-gray d-flex flex-column">
        <h5 className="card-title fs-6 fw-normal">{prop.title}</h5>
        <p className="card-text fw-light">{prop.description}</p>
        <div className="d-flex justify-content-between mt-auto">
          <p className="fw-lighter fs-date mb-0">{timeAgo}</p>
          <p className="fw-lighter fs-date mb-0">{prop.author['name']}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
