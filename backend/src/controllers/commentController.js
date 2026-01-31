import { Comment } from "../models/Comment.model.js";
import { Post } from "../models/Post.model.js";
import { Group } from "../models/Group.model.js";

// ADD COMMENT
export const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const { comment } = req.body;

        //  content check
        if (!comment) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        // post exist?
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        //  group find (via post)
        const group = await Group.findById(post.groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        // member check
        const isMember = group.members.some(
            id => id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Only group members can comment"
            });
        }

        //  create comment
        const newComment = await Comment.create({
            postId,
            author: userId,
            comment
        });

        return res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// GET COMMENTS OF A POST
export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        // post check
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // group check
        const group = await Group.findById(post.groupId);
        const isMember = group.members.some(
            id => id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Only group members can view comments"
            });
        }

        const comments = await Comment.find({ postId })
            .populate("author", "username")
            .sort({ createdAt: 1 }); // old → new

        return res.json({
            success: true,
            comments
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

//delete group comment
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.userId;

        //  comment exist?
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        //  author check
        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this comment"
            });
        }

        //  delete
        await comment.deleteOne();

        return res.json({
            message: "Comment deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};