import { Post } from "../models/Post.model.js";
import { Group } from "../models/Group.model.js";

export const createPost = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.userId;
        const { content } = req.body;

        // content check
        if (!content) {
            return res.status(400).json({
                message: "Post content is empty"
            });
        }

        //  group exist?
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        //  member check
        const isMember = group.members.some(
            id => id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Only group members can create posts"
            });
        }

        //  post create
        const post = await Post.create({
            groupId,
            author: userId,
            content
        });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getGroupPosts = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.userId;

        //  group exist?
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            });
        }

        //  member check
        const isMember = group.members.some(
            id => id.toString() === userId
        );

        if (!isMember) {
            return res.status(403).json({
                message: "Only group members can view posts"
            });
        }

        // fetch posts of THIS group only
        const posts = await Post.find({ groupId })
            .populate("author", "username")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            posts
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        // post exist?
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // author check
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this post"
            });
        }

        // delete post
        await post.deleteOne();

        return res.json({
            message: "Post deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        // post exist?
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        //  already liked?
        const alreadyLiked = post.likes.some(
            id => id.toString() === userId
        );

        if (alreadyLiked) {
            //  UNLIKE (remove)
            post.likes = post.likes.filter(
                id => id.toString() !== userId
            );

            await post.save();

            return res.json({
                message: "Like removed",
                success: true,
                likesCount: post.likes.length
            });
        } else {
            // LIKE (add)
            post.likes.push(userId);
            await post.save();

            return res.json({
                message: "Post liked",
                success: true,
                likesCount: post.likes.length
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

