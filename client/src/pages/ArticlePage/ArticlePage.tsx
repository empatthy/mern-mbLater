import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

import { TimeAgo, NavBar, Comment, getDateNowISO, Loader } from '../../components';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useParams, Link } from 'react-router-dom';
import {
  addReaction,
  AddReactionPayload,
  removeReaction,
  RemoveReactionPayload,
  selectItemReactions,
} from '../../redux/slices/reactionsSlice';
import {
  addComment,
  AddCommentPayload,
  selectArticleComments,
  getArticleComments,
} from '../../redux/slices/commentSlice';
import { selectUserId } from '../../redux/slices/authSlice';
import { deleteArticle } from '../../redux/slices/articlesSlice';
import ArticleService from '../../services/ArticleService';
import { ReactionIcon } from '../../components/svg/ReactionIcon';
import { IArticle } from '../../models/IArticle';

import styles from './article-page.module.scss';

import userIcon from '../../img/user.svg';
import deleteArticleIcon from '../../img/can.svg';
import editArticleIcon from '../../img/edit.svg';
import viewsIcon from '../../img/views-icon.svg';

export const ArticlePage: React.FC = () => {
  const [article, setArticle] = useState<IArticle>();

  const [body, setBody] = useState<string>('');
  const dispatch = useAppDispatch();
  const { articleId } = useParams();
  const authUserId = useAppSelector(selectUserId);
  const avatarUrl = useAppSelector((state) => state.auth.user.avatarUrl);

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
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        try {
          const response = await ArticleService.getArticle(articleId);
          setArticle(response.data);
        } catch (e) {
          console.log(e);
        }
      };
      fetchArticle();
    }
  }, [articleId]);

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
    if (article) {
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

  return (
    <div className="wrapper">
      <NavBar />
      {article ? (
        <div className={styles.articleWrapper}>
          <div className={`container ${styles.articleContainer}`}>
            <h2>{article.title}</h2>
            <div className={styles.article}>
              {article.pictureUrl && (
                <img src={`http://localhost:8000${article.pictureUrl}`} alt="Preview" />
              )}
              <div className={styles.body}>
                <ReactMarkdown children={article.body} />
              </div>
            </div>
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
                  onClick={
                    userReaction?.reactionType === false ? removeReactionHandle : dislikeHandle
                  }
                  type="button">
                  <div
                    className={
                      userReaction?.reactionType === false
                        ? styles.dislikeSvgActive
                        : styles.dislikeSvg
                    }>
                    <ReactionIcon />
                  </div>
                </button>
                <p>{dislikes.length}</p>
                <img src={viewsIcon} alt="views" />
                <p>{article.views}</p>
                {authUserId === article.author._id && (
                  <>
                    <Link to={`/articles/${articleId}/edit`}>
                      <img src={editArticleIcon} alt="Edit" />
                    </Link>
                    <Link to="/articles">
                      <img src={deleteArticleIcon} onClick={deleteArticleHandle} alt="Delete" />
                    </Link>
                  </>
                )}
              </div>
              <div className={styles.authorWrapper}>
                <Link to={`/users/${article.author._id}`} className={styles.author}>
                  <img
                    src={
                      article.author.avatarUrl
                        ? `http://localhost:8000${article.author.avatarUrl}`
                        : userIcon
                    }
                    alt="Avatar"
                  />
                  <p>{article.author.name}</p>
                </Link>
                <TimeAgo date={article.date} />
              </div>
            </div>
            <div className={styles.commentsWrapper}>
              <div className={styles.commentsContainer}>
                <h5>Комментарии</h5>
                <div className={styles.addCommentBlock}>
                  <img
                    className="avatar"
                    src={avatarUrl ? `http://localhost:8000${avatarUrl}` : userIcon}
                    alt="Avatar"
                  />
                  <div className={styles.commentInputBlock}>
                    <div>
                      <TextareaAutosize
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        placeholder="Текст комментария"
                        minRows={1}
                      />
                    </div>
                    <button onClick={addCommentHandle} disabled={!body} type="button">
                      оставить комментарий
                    </button>
                  </div>
                </div>
                {renderedComments()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};
