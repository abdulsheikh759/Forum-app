import api from "./axios";

export const fetchPosts = async (groupId) => {
  const res = await api.get(`/posts/${groupId}`);
  return res.data.posts;
};

export const createPost = async (groupId, content) => {
  const res = await api.post(`/posts/${groupId}`, { content });
  return res.data.post;
};

export const toggleLike = async (postId) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data;
};
