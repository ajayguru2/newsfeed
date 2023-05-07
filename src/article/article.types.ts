export type ArticleCreateRequest = {
  title: string;
  description: string;
  body: string;
  imageUrl: string;
};

export type ArticleUpdateRequest = {
  uuid: string;
  title?: string;
  description?: string;
  body?: string;
  imageUrl?: string;
};

export type ArticleResponse = {
  id: string;
  title: string;
  description: string;
  body: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
};

export type ArticleListResponse = {
  articles: ArticleResponse[];
  articlesCount: number;
};
