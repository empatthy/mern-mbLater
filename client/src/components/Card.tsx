import React from 'react';

interface CardProp {
  _id: string;
  title: string;
  description: string;
  author: any;
  date: Date;
  likes: number;
  dislikes: number;
  key?: any;
}

export function Card(prop: CardProp) {
  const getPostDate = () => {
    const currDate = new Date();
    const postDate = new Date(prop.date);

    const diff = Math.abs(currDate.getTime() - postDate.getTime());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (minutes === 0 && hours === 0) {
      return 'Меньше минуты назад';
    }
    if (minutes > 0 && hours === 0) {
      return `${minutes} мин. назад`;
    }
    if (hours > 0 && hours <= 5) {
      return `${hours} ч. назад`;
    }
    return `${postDate.getDate()}.${
      postDate.getMonth() < 9 ? `0${postDate.getMonth() + 1}` : postDate.getMonth() + 1
    }.${postDate.getFullYear()} в ${postDate.getHours()}:${postDate.getMinutes()}`;
  };
  return (
    <div
      className="card my-3 me-3 rounded-0 border-secondary text-light"
      style={{ width: '24rem' }}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body bg-gray d-flex flex-column">
        <h5 className="card-title fs-6 fw-normal">{prop.title}</h5>
        <p className="card-text fw-light">{prop.description}</p>
        <div className="d-flex justify-content-between mt-auto">
          <p className="fw-lighter fs-date mb-0">{getPostDate()}</p>
          <p className="fw-lighter fs-date mb-0">{prop.author['name']}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
