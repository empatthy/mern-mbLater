import { useEffect, useState } from 'react';
import axios from 'axios';

import ArtcleService from '../services/ArticleService';

export function usePagination(pageNumber: number) {
  useEffect(() => {
    ArtcleService.fetchArticles();
  });
  return null;
}
