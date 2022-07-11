import React, { useContext, useState } from 'react';
import { TimeAgo, CommentAnswers, getDateNowISO } from './';
import { IUser } from '../models/IUser';
import { IArticle } from '../models/IArticle';
import { IComment } from '../models/IComment';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectUserId } from '../slices/authSlice';
import { replyComment } from '../slices/commentSlice';
import {
  selectItemReactions,
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
} from '../slices/reactionsSlice';
import {
  createNotification,
  CreateNotificationPayload,
  removeNotification,
  RemoveNotificationPayload,
} from '../slices/notificationsSlice';
import { SocketContext } from '../socket/socket-context';

import likeIcon from '../img/like-button.svg';
import likeIconActive from '../img/like-button-active.svg';
import dislikeIcon from '../img/dislike-button.svg';
import dislikeIconActive from '../img/dislike-button-active.svg';
import showRepliesIcon from '../img/show-replies-icon.svg';
import hideRepliesIcon from '../img/hide-replies-icon.svg';

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
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);

  const socketContext = useContext(SocketContext);
  console.log(socketContext.socket);

  const [textIsOpened, setTextIsOpened] = useState<boolean>(false);
  const [repliesIsOpened, setRepliesIsOpened] = useState<boolean>(false);
  const [body, setBody] = useState<string>('');

  const reactions = useAppSelector((state) => selectItemReactions(state, prop._id));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const replyCommentHandle = async () => {
    const answerToId = prop.answerTo! ? prop.answerTo._id : prop._id;
    const replyBody = prop.answerTo! ? `${prop.author.name}, ` + body : body;
    const replyPayload = {
      body: replyBody,
      articleId: prop.article._id,
      userId: authUserId,
      date: getDateNowISO(),
      answerTo: answerToId,
    };
    dispatch(replyComment(replyPayload));
    setBody('');
    setTextIsOpened(false);
    if (socketContext.socket) {
      const createNotificationPayload: CreateNotificationPayload = {
        senderId: authUserId,
        receiverId: prop.author._id,
        notificationType: 1,
        date: getDateNowISO(),
        to: prop._id,
      };
      dispatch(createNotification(createNotificationPayload));
      socketContext.socket.emit('sendNotification', {
        receiverId: prop.author._id,
      });
      console.log('receiverId', prop.author._id);
    }
  };

  const answers = () => {
    if (prop.replies.length > 0) {
      return (
        <p className="mt-2 color-grey fs-6" onClick={() => setRepliesIsOpened(!repliesIsOpened)}>
          <img className="me-3 pb-1" src={repliesIsOpened ? hideRepliesIcon : showRepliesIcon} />
          {repliesIsOpened ? 'Скрыть ответы' : `Показать ответы: ${prop.replies.length}`}
        </p>
      );
    }
  };

  const likeHandle = () => {
    if (prop.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
    if (!userReaction && socketContext.socket) {
      const addArticlePayload: AddReactionPayload = {
        to: prop._id,
        userId: authUserId,
        reactionType: true,
      };
      dispatch(addReaction(addArticlePayload));

      const createNotificationPayload: CreateNotificationPayload = {
        senderId: authUserId,
        receiverId: prop.author._id,
        notificationType: 0,
        date: getDateNowISO(),
        to: prop._id,
      };
      dispatch(createNotification(createNotificationPayload));
      socketContext.socket.emit('sendNotification', {
        receiverId: prop.author._id,
      });
      console.log('receiverId', prop.author._id);
    }
  };

  const dislikeHandle = () => {
    if (prop.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
    const addArticlePayload: AddReactionPayload = {
      to: prop._id,
      userId: authUserId,
      reactionType: false,
    };
    dispatch(addReaction(addArticlePayload));
  };

  const removeReactionHandle = () => {
    if (userReaction) {
      const removeRactionPayload: RemoveReactionPayload = {
        to: prop._id,
        userId: authUserId,
      };
      dispatch(removeReaction(removeRactionPayload));
      if (userReaction.reactionType) {
        const removeNotificationPayload: RemoveNotificationPayload = {
          senderId: authUserId,
          to: prop._id,
        };
        dispatch(removeNotification(removeNotificationPayload));
      }
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
          <img
            className="reaction-img my-auto cursor-p"
            onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
            src={userReaction?.reactionType === true ? likeIconActive : likeIcon}
            alt="like"
          />
          <p className="fw-lighter my-auto mx-3">{likes.length}</p>
          <img
            className="reaction-img my-auto cursor-p"
            onClick={userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle}
            src={userReaction?.reactionType === false ? dislikeIconActive : dislikeIcon}
            alt="dislike"
          />
          <p className="fw-lighter my-auto mx-3">{dislikes.length}</p>
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
