import React, { useEffect, useState } from 'react';
import { TimeAgo } from './TimeAgo';
import { IUser } from '../models/IUser';
import { IArticle } from '../models/IArticle';
import { IComment } from '../models/IComment';
import { useAppSelector } from '../hooks';
import { selectUserId } from '../slices/authSlice';
import { CommentAnswers } from './CommentAnswers';
import CommentService from '../services/CommentService';

interface CommentProp {
  _id: string;
  body: string;
  article: IArticle;
  author: IUser;
  date: string;
  answerTo: IComment;
  replies: string[];
}

export function Comment(prop: CommentProp) {
  const [textIsOpened, setTextIsOpened] = useState<boolean>(false);
  const [repliesIsOpened, setRepliesIsOpened] = useState<boolean>(false);
  const [body, setBody] = useState<string>('');
  const [replies, setReplies] = useState<IComment[]>();

  //console.log('replies', replies);

  const authUserId = useAppSelector(selectUserId);

  /* useEffect(() => {
    if (!prop.answerTo) {
      const fetchReplies = async () => {
        const response = await CommentService.getCommentReplies(prop._id);
        console.log('useEffect/replies', response.data);
        setReplies(response.data);
      };
      fetchReplies();
    }
  }, []); */

  /* const renderedReplies = () => {
    if (replies) {
      return replies.map((reply, index) => <Comment key={index} {...reply} />);
    }
  }; */

  const getDateNowISO = () => {
    const d = new Date().toISOString();
    return d;
  };

  const replyCommentHandle = async () => {
    const answerToId = prop.answerTo! ? prop.answerTo._id : prop._id;
    const replyBody = prop.answerTo! ? `${prop.author.name}, ` + body : body;
    const { data } = await CommentService.replyComment(
      replyBody,
      prop.article._id,
      authUserId,
      getDateNowISO(),
      answerToId,
    );
    setBody('');
    setTextIsOpened(false);
    setReplies([...replies!, data]);
  };

  const answers = () => {
    if (prop.replies.length > 0) {
      return (
        <p onClick={() => setRepliesIsOpened(!repliesIsOpened)}>
          {repliesIsOpened ? 'Скрыть ответы' : `Показать ответы: ${prop.replies.length}`}
        </p>
      );
    }
  };

  return (
    <div className="d-flex my-4">
      <div className="bg-gray avatar mx-2">я трубоёб Виталя</div>
      <div className="owerflow-hidden w-100">
        <div className="d-flex">
          <p className="me-3 mb-1">{prop.author.name}</p>
          <TimeAgo date={prop.date} />
        </div>
        <p className="mb-2">{prop.body}</p>
        <div className="d-flex">
          <img className="reaction-img my-auto" src="/img/like-button.svg" alt="like" />
          <p className="fw-lighter my-auto mx-3">0</p>
          <img className="reaction-img my-auto" src="/img/dislike-button.svg" alt="dislike" />
          <p className="fw-lighter my-auto mx-3">0</p>
          <button
            onClick={() => setTextIsOpened(true)}
            type="button"
            className="btn btn-success float-end">
            ОТВЕТИТЬ
          </button>
        </div>
        {textIsOpened && (
          <div className="overflow-hidden w-100">
            <div
              data-value={body}
              onInput={(e) => setBody(e.currentTarget.textContent!)}
              contentEditable="true"
              data-placeholder="Введите текст комментария"
              className="mb-2"></div>

            <button
              onClick={replyCommentHandle}
              disabled={!body}
              type="button"
              className="btn btn-success float-end">
              ОТВЕТИТЬ
            </button>
            <button
              onClick={() => setTextIsOpened(false)}
              type="button"
              className="btn btn-success float-end">
              ОТМЕНИТЬ
            </button>
          </div>
        )}
        {answers()}
        {repliesIsOpened && <CommentAnswers mainCommentId={prop._id} />}
      </div>
    </div>
  );
}
