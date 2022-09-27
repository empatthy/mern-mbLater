import React, { useContext, useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import TextareaAutosize from 'react-textarea-autosize';
import { TimeAgo, CommentAnswers, getDateNowISO } from '..';
import { IUser } from '../../models/IUser';
import { IArticle } from '../../models/IArticle';
import { IComment } from '../../models/IComment';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUserId } from '../../redux/slices/authSlice';
import {
  replyComment,
  PatchCommentPayload,
  patchComment,
  deleteComment,
} from '../../redux/slices/commentSlice';
import {
  selectItemReactions,
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
} from '../../redux/slices/reactionsSlice';
import {
  createNotification,
  CreateNotificationPayload,
  removeNotification,
  RemoveNotificationPayload,
} from '../../redux/slices/notificationsSlice';
import { SocketContext } from '../../socket/socket-context';
import { ReactionIcon } from '../svg/ReactionIcon';

import showRepliesIcon from '../../img/show-replies-icon.svg';
import hideRepliesIcon from '../../img/hide-replies-icon.svg';
import dropdownIcon from '../../img/comment-menu-icon.svg';
import editIcon from '../../img/edit-light.svg';
import deleteIcon from '../../img/can-light.svg';
import userIcon from '../../img/user.svg';

import styles from './comment.module.scss';

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
  const avatarUrl = useAppSelector((state) => state.auth.user.avatarUrl);

  const socketContext = useContext(SocketContext);

  const [textIsOpened, setTextIsOpened] = useState(false);
  const [repliesIsOpened, setRepliesIsOpened] = useState(false);
  const [body, setBody] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [newBody, setNewBody] = useState<string>('');

  const reactions = useAppSelector((state) => selectItemReactions(state, prop._id));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const replyCommentHandle = () => {
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

  const patchCommentDropdownHandle = () => {
    setIsEditing(true);
    setNewBody(prop.body);
    setDropdownIsOpen(false);
  };

  const patchCommentHandle = () => {
    const patchCommentPayload: PatchCommentPayload = {
      commentId: prop._id,
      body: newBody,
    };
    dispatch(patchComment(patchCommentPayload));
    setIsEditing(false);
    setNewBody('');
  };

  const deleteCommentHandle = () => {
    dispatch(deleteComment(prop._id));
    setDropdownIsOpen(false);
  };

  const likeHandle = () => {
    if (userReaction) {
      removeReactionHandle();
    }
    if (socketContext.socket) {
      const addReactionPayload: AddReactionPayload = {
        to: prop._id,
        userId: authUserId,
        reactionType: true,
      };
      dispatch(addReaction(addReactionPayload));

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
    }
  };

  const dislikeHandle = () => {
    if (userReaction) {
      removeReactionHandle();
    }
    const addReactionPayload: AddReactionPayload = {
      to: prop._id,
      userId: authUserId,
      reactionType: false,
    };
    dispatch(addReaction(addReactionPayload));
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

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownToggle = () => {
    setDropdownIsOpen(!dropdownIsOpen);
  };

  const outsideClickHandle = (event: Event) => {
    const path = event.composedPath && event.composedPath();
    if (dropdownRef.current && !path.includes(dropdownRef.current)) {
      setDropdownIsOpen(false);
    }
  };

  useEffect(() => {
    if (prop.author._id === authUserId) {
      document.body.addEventListener('click', outsideClickHandle);

      return () => document.body.removeEventListener('click', outsideClickHandle);
    }
  }, []);

  const answers = () => {
    if (prop.replies.length > 0) {
      return (
        <p className={styles.answers} onClick={() => setRepliesIsOpened(!repliesIsOpened)}>
          <img src={repliesIsOpened ? hideRepliesIcon : showRepliesIcon} alt="Ответы" />
          {repliesIsOpened ? 'Скрыть ответы' : `Показать ответы: ${prop.replies.length}`}
        </p>
      );
    }
  };

  return (
    <div className={styles.commentWrapper}>
      <img
        src={prop.author.avatarUrl ? prop.author.avatarUrl : userIcon}
        className="avatar"
        alt="Avatar"
      />
      <div className={styles.comment}>
        <div className={styles.infoBlock}>
          <div className={styles.authorBlock}>
            <p>{prop.author.name}</p>
            <TimeAgo date={prop.date} />
          </div>

          {prop.author._id === authUserId && (
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <img onClick={dropdownToggle} src={dropdownIcon} alt="Dropdown" />
              <CSSTransition
                in={dropdownIsOpen}
                timeout={300}
                classNames="commentDropdown"
                unmountOnExit
                onEnter={() => setDropdownIsOpen(true)}
                onExited={() => setDropdownIsOpen(false)}>
                <ul className={styles.commentDropdown}>
                  <li onClick={patchCommentDropdownHandle}>
                    <img src={editIcon} alt="Edit" />
                    Изменить
                  </li>
                  <li onClick={deleteCommentHandle}>
                    <img src={deleteIcon} alt="Delete" />
                    Удалить
                  </li>
                </ul>
              </CSSTransition>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className={styles.commentBody}>
            <input
              spellCheck={false}
              onChange={(e) => setNewBody(e.target.value)}
              value={newBody}
            />
            <button onClick={patchCommentHandle}>Сохранить изменения</button>
            <button onClick={() => setIsEditing(false)}>Отменить</button>
          </div>
        ) : (
          <div className={styles.commentBody}>{prop.body}</div>
        )}
        <div className={styles.commentReactions}>
          <button
            onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
            disabled={prop.author._id === authUserId}
            type="button">
            <div
              className={
                userReaction?.reactionType === true ? styles.likeSvgActive : styles.likeSvg
              }>
              <ReactionIcon />
            </div>
          </button>
          <p>{likes.length}</p>
          <button
            onClick={userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle}
            disabled={prop.author._id === authUserId}
            type="button">
            <div
              className={
                userReaction?.reactionType === false ? styles.dislikeSvgActive : styles.dislikeSvg
              }>
              <ReactionIcon />
            </div>
          </button>
          <p>{dislikes.length}</p>
          {authUserId && (
            <button onClick={() => setTextIsOpened(true)} type="button">
              ОТВЕТИТЬ
            </button>
          )}
        </div>
        {textIsOpened && (
          <div className={styles.answerWrapper}>
            <img src={avatarUrl ? avatarUrl : userIcon} alt="Avatar" />
            <div className={styles.answerInputBlock}>
              <div>
                <TextareaAutosize
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Текст комментария"
                  minRows={1}
                />
              </div>
              <button onClick={replyCommentHandle} disabled={!body} type="button">
                ОТВЕТИТЬ
              </button>
              <button onClick={() => setTextIsOpened(false)} type="button">
                ОТМЕНИТЬ
              </button>
            </div>
          </div>
        )}
        {answers()}
        {repliesIsOpened && <CommentAnswers mainCommentId={prop._id} />}
      </div>
    </div>
  );
}
