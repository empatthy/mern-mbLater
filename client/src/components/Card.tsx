import { parseISO, formatDistanceToNow } from 'date-fns';
import { TimeAgo } from './TimeAgo';
import { Link } from 'react-router-dom';
import { IUser } from '../models/IUser';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectArticleReactions,
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
} from '../slices/reactionsSlice';
import { selectUserId } from '../slices/authSlice';

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

  const reactions = useAppSelector((state) => selectArticleReactions(state, prop._id));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const likeHandle = () => {
    if (userReaction) {
      removeReactionHandle();
    }
    const addArticlePayload: AddReactionPayload = {
      articleId: prop._id,
      userId: authUserId,
      reactionType: true,
    };
    dispatch(addReaction(addArticlePayload));
  };

  const dislikeHandle = () => {
    if (userReaction) {
      removeReactionHandle();
    }
    const addArticlePayload: AddReactionPayload = {
      articleId: prop._id,
      userId: authUserId,
      reactionType: false,
    };
    dispatch(addReaction(addArticlePayload));
  };

  const removeReactionHandle = () => {
    if (userReaction) {
      const removeRactionPayload: RemoveReactionPayload = {
        articleId: prop._id,
        userId: authUserId,
      };
      dispatch(removeReaction(removeRactionPayload));
    }
  };

  let timeAgo = '';
  if (prop.date) {
    const date = parseISO(prop.date);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }

  return (
    <div className="card my-3 me-3 rounded-0 border-gray text-light" style={{ width: '24rem' }}>
      {/* <img src="..." className="card-img-top" alt="..." /> */}
      <div className="card-body bg-gray d-flex flex-column">
        <h5 className="card-title fs-6 fw-normal">{prop.title}</h5>
        <p className="card-text fw-light">{prop.description}</p>
        <div className="d-flex justify-content-between mt-auto">
          <div className="d-flex justify-content-between mt-auto mb-2">
            <img
              onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
              src={
                userReaction?.reactionType === true
                  ? '/img/like-button-active.svg'
                  : '/img/like-button.svg'
              }
              alt="like"
            />
            <p className="fw-lighter fs-date mb-0 mx-3">{likes.length}</p>
            <img
              onClick={userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle}
              src={
                userReaction?.reactionType === false
                  ? '/img/dislike-button-active.svg'
                  : '/img/dislike-button.svg'
              }
              alt="dislike"
            />
            <p className="fw-lighter fs-date mb-0 mx-3">{dislikes.length}</p>
          </div>
          <Link to={`/articles/${prop._id}`} className="text-decoration-none text-light">
            View Post
          </Link>
          <div>
            <Link to={`/users/${prop.author._id}`} className="text-decoration-none text-light">
              <p className="fw-lighter fs-date mb-0">{prop.author.name}</p>
            </Link>
            <TimeAgo date={prop.date} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
