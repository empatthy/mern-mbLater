import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { NavBar, getDateNowISO } from '../../components';
import { addArticle, ArticlePayload, patchArticlePayload } from '../../redux/slices/articlesSlice';
import { selectUserId } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import FileService from '../../services/FileService';
import ArticleService from '../../services/ArticleService';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';

import styles from './add-article-page.module.scss';

import imgPlaceholder from '../../img/picture-placeholder.svg';
import addImgIcon from '../../img/add-cross-icon.svg';
import { BackIcon } from '../../components/svg/BackIcon';

export const AddArticlePage: React.FC = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUserId);

  const isEditing = !!articleId;

  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [pictureUrl, setPictureUrl] = useState<string>('');

  const inputFileRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  const articlePayload: ArticlePayload = {
    title: title,
    body: body,
    author: userId,
    date: getDateNowISO(),
    pictureUrl,
  };

  const patchArticlePayload: patchArticlePayload = {
    title: title,
    body: body,
    author: userId,
    pictureUrl,
  };

  const changeBodyHandle = useCallback((body) => {
    setBody(body);
  }, []);

  const simpleMdeOptions = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '500px',
      autofocus: true,
      placeholder: 'Текст статьи',
      status: false,
      autosave: {
        enabled: true,
        uniqueId: 'body-text-area',
        delay: 1000,
      },
    }),
    [],
  );

  const changeFileHandle = async (event: any) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await FileService.uploadPicture(formData);
      console.log(data);
      setPictureUrl(data);
    } catch (e) {
      console.log(e);
    }
  };

  const addArticleHandle = () => {
    dispatch(addArticle(articlePayload));
    setTitle('');
    setBody('');
    setPictureUrl('');
    navigate(`/articles`);
  };

  const updateArticleHandle = async () => {
    if (articleId) {
      const { data } = await ArticleService.patchArticle(articleId, patchArticlePayload);
      navigate(`/articles/${data._id}`);
    }
  };

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        const { data } = await ArticleService.getArticle(articleId);
        setTitle(data.title);
        setBody(data.body);
        setPictureUrl(data.pictureUrl);
      };
      fetchArticle();
    }
  }, []);

  return (
    <div className="wrapper">
      <NavBar />
      <div className={`${styles.addArticle} container`}>
        <div className={styles.imageBlock}>
          <div className={styles.imageContainer}>
            {pictureUrl ? (
              <img src={pictureUrl} alt="Preview" />
            ) : (
              <div className={styles.imgPlaceholder}>
                <img src={imgPlaceholder} />
              </div>
            )}
            <div className={styles.addImg} onClick={() => inputFileRef.current.click()}>
              <img src={addImgIcon} />
            </div>
          </div>
          <div className={styles.cardBody}>{<h4>{title ? title : 'Заголовок'}</h4>}</div>
        </div>

        <input ref={inputFileRef} type="file" onChange={changeFileHandle} hidden />

        <div className={styles.inputBlock}>
          <input
            type="text"
            value={title}
            placeholder="Заголовок"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.bodyBlock}>
          <SimpleMDE
            className="bg-light"
            id="body-text-area"
            value={body}
            onChange={changeBodyHandle}
            options={simpleMdeOptions}
          />
        </div>

        <div className={styles.buttonsBlock}>
          <button
            onClick={isEditing ? updateArticleHandle : addArticleHandle}
            disabled={!title || !body}>
            {isEditing ? 'Применить изменения' : 'Опубликовать'}
          </button>
          <button onClick={() => navigate('/')}>
            <BackIcon />
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};
