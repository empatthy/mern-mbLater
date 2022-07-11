import React, { useState } from 'react';

import { NavBar, getDateNowISO } from '../components';
import { addArticle, addArticlePayload } from '../slices/articlesSlice';
import { selectUserId } from '../slices/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks';

export const AddArticlePage: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);

  const [title, setTitle] = useState<string>('');
  const [description, setDesc] = useState<string>('');
  const [body, setBody] = useState<string>('');

  const articlePayload: addArticlePayload = {
    title: title,
    description: description,
    body: body,
    author: userId,
    date: getDateNowISO(),
  };

  const addArticleHandle = () => {
    dispatch(addArticle(articlePayload));
    setTitle('');
    setDesc('');
    setBody('');
  };

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div className="container mt-3">
        <div>
          <div className="form-floating my-3">
            <textarea
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              placeholder="Leave a comment here"
              id="floatingTextarea"></textarea>
            <label>Заголовок</label>
          </div>
          <div className="form-floating">
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={description}
              className="form-control my-3"
              placeholder="Leave a comment here"
              id="floatingTextarea"></textarea>
            <label>Описание</label>
          </div>
          <div className="form-floating">
            <textarea
              onChange={(e) => setBody(e.target.value)}
              value={body}
              className="form-control my-3"
              placeholder="Leave a comment here"
              id="floatingTextarea"></textarea>
            <label>Тело статьи</label>
          </div>
        </div>
        <button
          onClick={addArticleHandle}
          disabled={!title || !description || !body}
          className="btn btn-success">
          Опубликовать
        </button>
      </div>
    </div>
  );
};
