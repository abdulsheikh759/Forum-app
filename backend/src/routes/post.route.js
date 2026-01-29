import express from "express";
import authProtect from "../middlewares/authMiddleware.js";
import { createPost, deletePost, getGroupPosts, toggleLike } from "../controllers/postController.js";

const router = express.Router();

// sirf post banana
router.post("/:groupId", authProtect, createPost);

//show group posts only to group members
router.get("/:groupId", authProtect, getGroupPosts);

//likes post
router.post("/:postId/like", authProtect, toggleLike);

//delete post sirf author kr skta hai (future me add krna hai)
router.delete("/:postId", authProtect, deletePost);

export default router;
