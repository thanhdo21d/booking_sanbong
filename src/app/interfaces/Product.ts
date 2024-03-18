import { ICategory } from './Category';
import { IUser } from './User';

interface IImage {
  _id: string;
  url: string;
  public_id: string;
}

export interface IPosts {
  _id: string;
  title: string;
  author: IUser;
  content: string;
  images: IImage[];
  likes: number | string;
  tags: any[];
  category: ICategory;
  comments: any[];
  is_active: boolean;
  status: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  price : string
}

export interface IDocPosts {
  message: string;
  posts: IDocs;
}

interface IDocs {
  docs: IPosts[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: null | number;
  nextPage?: null | number;
}

export interface IPostAnalytics {
  message: string;
  count: number;
}
