import React, { useEffect, useState } from 'react';

import { NavBar } from '../components/NavBar';
import { addArticle, addArticlePayload } from '../slices/articlesSlice';
import { selectUserId } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const AddArticlePage: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);

  const [title, setTitle] = useState<string>('');
  const [description, setDesc] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const getDateNowISO = () => {
    const d = new Date().toISOString();
    return d;
  };

  const articlePayload: addArticlePayload = {
    title: title,
    description: description,
    body: body,
    author: userId,
    date: getDateNowISO(),
  };

  const addArticleHandle = () => {
    dispatch(addArticle(articlePayload));
    console.log(articlePayload);
  };

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div>
        <p className="text-light my-3">Title</p>
        <input
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="me-2"
        />
        <p className="text-light my-3">Description</p>
        <input
          name="desc"
          onChange={(e) => setDesc(e.target.value)}
          value={description}
          className="me-2"
        />
        <p className="text-light my-3">Body</p>
        <input
          name="body"
          onChange={(e) => setBody(e.target.value)}
          value={body}
          className="me-2"
        />
      </div>
      <button onClick={addArticleHandle} className="btn btn-success">
        Опубликовать
      </button>
    </div>
  );
};
