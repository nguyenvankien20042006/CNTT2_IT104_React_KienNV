import { apiClient } from "../utils/apiClient";

export const getAllPost = async () => {
  const response = await apiClient.get("posts");

  return response.data;
};
