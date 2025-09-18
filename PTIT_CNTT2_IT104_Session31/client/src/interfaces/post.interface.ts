import type { PostStatus } from "../enums/post.enum";

export interface CreatePost {
  title?: string;
  imageUrl?: string;
  status: PostStatus;
  content?: string;
  createdAt?: string;
}
export interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
  status: "published" | "draft";
  content?: string; // thêm field content, optional
}
