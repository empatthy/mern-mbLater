import { useRef, useEffect, useState } from 'react';
import { TimeAgo, getDateNowISO } from '../TimeAgo/TimeAgo';
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../../models/IUser';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectItemReactions,
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
} from '../../redux/slices/reactionsSlice';
import { selectUserId } from '../../redux/slices/authSlice';
import {
  createNotification,
  CreateNotificationPayload,
} from '../../redux/slices/notificationsSlice';
import CommentService from '../../services/CommentService';

import styles from './card.module.scss';
import { ReactionIcon } from '../svg/ReactionIcon';
import userIcon from '../../img/user.svg';
import commentIcon from '../../img/comment-icon.svg';
import viewsIcon from '../../img/views-icon.svg';

interface CardProp {
  _id: string;
  title: string;
  body: string;
  author: IUser;
  date: string;
  pictureUrl: string;
  views: number;
}

export function Card(prop: CardProp) {
  const [commentsCount, setCommentsCount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);
  const navigate = useNavigate();

  const reactions = useAppSelector((state) => selectItemReactions(state, prop._id));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const cardRef = useRef(null);

  useEffect(() => {
    const getArticleCommentsCount = async () => {
      const response = await CommentService.getArticleCommentsCount(prop._id);
      setCommentsCount(response.data.length);
    };
    getArticleCommentsCount();
  }, []);

  const likeHandle = () => {
    if (prop.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
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
    }
  };

  useEffect(() => {
    const cardClickHandle = (event: Event) => {
      const path = event.composedPath && event.composedPath();
      if (cardRef.current && path.includes(cardRef.current)) {
        navigate(`/articles/${prop._id}`);
      }
    };

    document.body.addEventListener('click', cardClickHandle);

    return () => {
      document.removeEventListener('click', cardClickHandle);
    };
  }, []);

  const cardClickHandle = (event: Event) => {
    const path = event.composedPath();
    if (cardRef.current && path.includes(cardRef.current)) {
      navigate(`/articles/${prop._id}`);
    }
  };

  return (
    <div onClick={() => cardClickHandle} ref={cardRef} className={styles.card}>
      {prop.pictureUrl && (
        <img
          src={`http://localhost:8000${prop.pictureUrl}`}
          className="card-img-top bg-light"
          alt="Preview"
        />
      )}
      <div className={styles.cardBody}>
        <h4>{prop.title}</h4>
        <div className={styles.info}>
          <div className={styles.reactions}>
            <button
              onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
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
              type="button">
              <div
                className={
                  userReaction?.reactionType === false ? styles.dislikeSvgActive : styles.dislikeSvg
                }>
                <ReactionIcon />
              </div>
            </button>
            <p>{dislikes.length}</p>
            <img src={commentIcon} alt="comments" />
            <p>{commentsCount}</p>
            <img src={viewsIcon} alt="views" />
            <p>{prop.views}</p>
          </div>
          <div>
            <Link to={`/users/${prop.author._id}`} className={styles.authorInfo}>
              <img
                className="author-avatar"
                src={
                  prop.author.avatarUrl ? `http://localhost:8000${prop.author.avatarUrl}` : userIcon
                }
                alt="Avatar"
              />
              <p>{prop.author.name}</p>
            </Link>
            <TimeAgo date={prop.date} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
