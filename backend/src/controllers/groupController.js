import { Group } from "../models/Group.model.js";

// ✅ Create Group (logged-in user)
export const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "All fields required", success: false });
        }

        const group = await Group.create({
            name,
            description,
            members: [req.userId] // creator auto-join
        });

        res.status(201).json({
            message: "Group created",
            success: true,
            group
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Group with this name already exists",
                success: false
            });
        }

        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Get All Groups (public)
export const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.json({ message: "Groups fetched", success: true, groups });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

// ✅ Join Group (logged-in user)
export const joinGroup = async (req, res) => {
    try {

        const groupId = req.params.id;
        const userId = req.userId;

        //  find group
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }

        //  check already member
        const isMember = group.members.some(
            memberId => memberId.toString() === userId
        );

        if (isMember) {
            return res.status(400).json({
                message: "You have already joined this group",
                success: false
            });
        }

        //  join group
        group.members.push(userId);
        await group.save();

        return res.json({
            message: "Joined group successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

// ✅ Get Group Members (logged-in user)
export const getGroupMembers = async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await Group.findById(groupId)
            .populate("members", "username email");

        if (!group) {
            return res.status(404).json({
                message: "Group not found",
                success: false
            });
        }

        return res.json({
            message: "Members fetched",
            success: true,
            members: group.members
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};
