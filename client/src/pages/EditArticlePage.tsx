import React from 'react';

import { NavBar } from '../components/NavBar';

export const EditArticlePage: React.FC = (props) => {
  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <button className="btn btn-success">Опубликовать</button>
    </div>
  );
};
