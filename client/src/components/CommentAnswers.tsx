import React, { useEffect, useState } from 'react';
import { TimeAgo } from './TimeAgo';
import { IUser } from '../models/IUser';
import { IArticle } from '../models/IArticle';
import { IComment } from '../models/IComment';
import { useAppSelector } from '../hooks';
import { selectUserId } from '../slices/authSlice';
import CommentService from '../services/CommentService';
import { Comment } from './Comment';

interface CommentAnswersProps {
  mainCommentId: string;
}

export function CommentAnswers(prop: CommentAnswersProps) {
  const [replies, setReplies] = useState<IComment[]>();
  console.log('replies', replies);

  useEffect(() => {
    const fetchReplies = async () => {
      const response = await CommentService.getCommentReplies(prop.mainCommentId);
      console.log('useEffect/replies', response.data);
      setReplies(response.data);
    };
    fetchReplies();
  }, []);

  const renderedReplies = () => {
    if (replies) {
      return replies.map((reply, index) => <Comment key={index} {...reply} />);
    }
  };

  return <div className="replies">{renderedReplies()}</div>;
}
