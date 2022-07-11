import { useRef } from 'react';
import { TimeAgo, getDateNowISO } from './TimeAgo';
import { Link } from 'react-router-dom';
import { IUser } from '../models/IUser';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectItemReactions,
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
} from '../slices/reactionsSlice';
import { selectUserId } from '../slices/authSlice';
import { createNotification, CreateNotificationPayload } from '../slices/notificationsSlice';

import likeIcon from '../img/like-button.svg';
import likeIconActive from '../img/like-button-active.svg';
import dislikeIcon from '../img/dislike-button.svg';
import dislikeIconActive from '../img/dislike-button-active.svg';

interface CardProp {
  _id: string;
  title: string;
  description: string;
  body: string;
  author: IUser;
  date: string;
}

export function Card(prop: CardProp) {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector(selectUserId);

  const reactions = useAppSelector((state) => selectItemReactions(state, prop._id));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const cardRef = useRef(null);

  const likeHandle = () => {
    if (prop.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
    if (!userReaction) {
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
    }
  };

  const dislikeHandle = () => {
    if (prop.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }

    if (!userReaction) {
      const addArticlePayload: AddReactionPayload = {
        to: prop._id,
        userId: authUserId,
        reactionType: false,
      };
      dispatch(addReaction(addArticlePayload));
    }
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

  const cardClickHandle = (event: Event) => {
    const path = event.composedPath && event.composedPath();
    if (cardRef.current && path.includes(cardRef.current)) {
    }
  };

  return (
    <div className="card my-3 me-3 rounded-0 border-gray text-light" style={{ width: '24rem' }}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <Link to={`/articles/${prop._id}`} className="text-decoration-none">
        <div className="card-body bg-gray d-flex flex-column">
          <h5 className="card-title fs-6 fw-normal text-light">{prop.title}</h5>
          <p className="card-text fw-light text-light">{prop.description}</p>
          <div className="d-flex justify-content-between mt-auto">
            <div className="d-flex justify-content-between mt-auto mb-2">
              <img
                className="cursor-p"
                onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
                src={userReaction?.reactionType === true ? likeIconActive : likeIcon}
                alt="like"
              />
              <p className="fw-lighter fs-date mb-0 mx-3 text-light">{likes.length}</p>
              <img
                className="cursor-p"
                onClick={
                  userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle
                }
                src={userReaction?.reactionType === false ? dislikeIconActive : dislikeIcon}
                alt="dislike"
              />
              <p className="fw-lighter fs-date mb-0 mx-3 text-light">{dislikes.length}</p>
            </div>
            <div>
              <Link to={`/users/${prop.author._id}`} className="text-decoration-none text-light">
                <p className="fw-lighter fs-date mb-0 text-end">{prop.author.name}</p>
              </Link>
              <TimeAgo date={prop.date} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;
