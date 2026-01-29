//pacakges install and imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//project files imports
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/user.route.js";
import groupRoutes from "./src/routes/group.route.js";
import postRoutes from "./src/routes/post.route.js";
import commentRoutes from "./src/routes/comment.routes.js";

//dotenv config
dotenv.config();

const app = express();

//Middleware in build
app.use(cors());
app.use(express.json());
app.use(cookieParser());


//Routes Middleware
//user api
app.use("/api/users", userRoutes);
//groups api
app.use("/api/data", groupRoutes);
//posts api
app.use("/api/posts", postRoutes);
//comments api
app.use("/api/comments", commentRoutes);

//Database Connection
connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});