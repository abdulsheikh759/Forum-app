import express from "express";
import {
  createGroup,
  getAllGroups,
  joinGroup,
  getGroupMembers
} from "../controllers/groupController.js";
import authProtect from "../middlewares/authMiddleware.js";

const router = express.Router();

// public
router.get("/groups", getAllGroups);

// protected
router.post("/groups", authProtect, createGroup);
router.post("/groups/:id/join", authProtect, joinGroup);
router.get("/groups/:id/members", authProtect, getGroupMembers);

export default router;
