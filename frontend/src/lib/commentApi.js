import api from "./axios";

// get comments of a post
export const getComments = async (postId) => {
  const res = await api.get(`/comments/${postId}`);
  return res.data.comments;
};

// add comment
export const addComment = async (postId, content) => {
  const res = await api.post(`/comments/${postId}`, { comment: content });
  return res.data.comment;
};

// delete comment
export const deleteComment = async (commentId) => {
  await api.delete(`/comments/${commentId}`);
};
