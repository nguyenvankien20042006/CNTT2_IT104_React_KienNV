import type { CreatePost } from "../interfaces/post.interface";
import { apiClient } from "../utils/apiClient";

/**
 * Hàm gọi API lấy danh sách bài viết
 * @returns
 */
export const getAllPost = async () => {
  const response = await apiClient.get("posts");

  return response.data;
};

export const createPost = async (createPost: CreatePost) => {
  const response = await apiClient.post("posts", createPost);

  return response;
};
