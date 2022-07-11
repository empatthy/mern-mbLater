import React, { useEffect, useState } from 'react';

import { TimeAgo, NavBar, Comment, getDateNowISO } from '../components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useParams, Link } from 'react-router-dom';
import {
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
  selectItemReactions,
} from '../slices/reactionsSlice';
import {
  addComment,
  AddCommentPayload,
  selectArticleComments,
  getArticleComments,
} from '../slices/commentSlice';
import { selectUserId } from '../slices/authSlice';
import { deleteArticle } from '../slices/articlesSlice';

import likeIcon from '../img/like-button.svg';
import likeIconActive from '../img/like-button-active.svg';
import dislikeIcon from '../img/dislike-button.svg';
import dislikeIconActive from '../img/dislike-button-active.svg';

export const ArticlePage: React.FC = () => {
  const [body, setBody] = useState<string>('');
  const dispatch = useAppDispatch();
  const { articleId } = useParams();
  const article = useAppSelector((state) =>
    state.articles.items.find((item) => item._id === articleId),
  );
  const authUserId = useAppSelector(selectUserId);

  const reactions = useAppSelector((state) => selectItemReactions(state, articleId));
  const likes = reactions.filter((item) => item.reactionType === true);
  const dislikes = reactions.filter((item) => item.reactionType === false);
  const userReaction = reactions.find((item) => item.user === authUserId);

  const comments = useAppSelector(selectArticleComments);
  const renderedComments = () => {
    return comments.map((comment, index) => <Comment key={index} {...comment} />);
  };

  useEffect(() => {
    dispatch(getArticleComments(articleId!));
  }, [dispatch]);

  const deleteArticleHandle = () => {
    if (articleId) {
      dispatch(deleteArticle(articleId));
    }
  };

  const likeHandle = () => {
    if (article?.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
    if (article && !userReaction) {
      const addArticlePayload: AddReactionPayload = {
        to: article._id,
        userId: authUserId,
        reactionType: true,
      };
      dispatch(addReaction(addArticlePayload));
    }
  };

  const dislikeHandle = () => {
    if (article?.author._id === authUserId) {
      return;
    }
    if (userReaction) {
      removeReactionHandle();
    }
    if (article) {
      const addArticlePayload: AddReactionPayload = {
        to: article._id,
        userId: authUserId,
        reactionType: false,
      };
      dispatch(addReaction(addArticlePayload));
    }
  };

  const removeReactionHandle = () => {
    if (article && userReaction) {
      const removeRactionPayload: RemoveReactionPayload = {
        to: article?._id,
        userId: authUserId,
      };
      dispatch(removeReaction(removeRactionPayload));
    }
  };

  const addCommentHandle = () => {
    const addCommentPayload: AddCommentPayload = {
      body: body,
      articleId: articleId!,
      userId: authUserId,
      date: getDateNowISO(),
    };
    dispatch(addComment(addCommentPayload));
    setBody('');
  };

  if (!article) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <div className="wrapper bg-dark">
      <NavBar />
      <div className="article-container ms-auto me-auto">
        <div className="container py-3 text-light">
          <h2 className="my-4 mx-3">{article.title}</h2>
          <div className="bg-gray p-3 border-all border-gray">
            <p className="mx-4">{article.description}</p>
            {article.body.split('\n').map((str, index) => (
              <p key={index} className="mb-1 mx-4">
                {str}
              </p>
            ))}
          </div>
          <div className="bg-gray-lighten d-flex border-bot border-lr border-gray">
            <div className="d-flex ms-4 my-2">
              <img
                className="reaction-img my-auto cursor-p"
                onClick={userReaction?.reactionType === true ? removeReactionHandle : likeHandle}
                src={userReaction?.reactionType === true ? likeIconActive : likeIcon}
                alt="like"
              />
              <p className="fw-lighter my-auto mx-3">{likes.length}</p>
              <img
                className="reaction-img my-auto cursor-p"
                onClick={
                  userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle
                }
                src={userReaction?.reactionType === false ? dislikeIconActive : dislikeIcon}
                alt="dislike"
              />
              <p className="fw-lighter my-auto mx-3">{dislikes.length}</p>
            </div>
            {authUserId === article.author._id && (
              <Link className="text-decoration-none text-light" to="/articles">
                <div onClick={deleteArticleHandle} className="ms-auto me-4 my-3">
                  Удалить
                </div>
              </Link>
            )}
            <div className="ms-auto me-4 my-1">
              <Link className="text-decoration-none text-light" to={`/users/${article.author._id}`}>
                <p className="my-1 text-end">{article.author.name}</p>
              </Link>
              <TimeAgo date={article.date} />
            </div>
          </div>
          <div className="text-light mt-3 border-all border-gray">
            <div className="bg-gray p-3">
              <h5>Комментарии</h5>
              <div className="d-flex my-3 ">
                <div className="bg-gray avatar mx-2">я трубоёб Виталя</div>
                <div className="overflow-hidden w-100">
                  <div
                    data-value={body}
                    onInput={(e) => setBody(e.currentTarget.textContent!)}
                    contentEditable="true"
                    data-placeholder="Введите текст комментария"
                    className="mb-2"></div>
                  <button
                    onClick={addCommentHandle}
                    disabled={!body}
                    type="button"
                    className="btn btn-success float-end">
                    ОСТАВИТЬ КОММЕНТАРИЙ
                  </button>
                </div>
              </div>

              {renderedComments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
