import express from "express";
import authProtect from "../middlewares/authMiddleware.js";
import {
  addComment,
  deleteComment,
  getPostComments
} from "../controllers/commentController.js";

const router = express.Router();

// add comment
router.post("/:postId", authProtect, addComment);

// get comments of a post
router.get("/:postId", authProtect, getPostComments);

// delete comment only by author 
router.delete("/:commentId", authProtect, deleteComment);

export default router;
