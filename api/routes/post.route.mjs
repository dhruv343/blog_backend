import express from "express";
import { create ,getPosts,deletePost} from "../controllers/post.controller.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";

const router=express.Router();

router.post("/post",verifyToken,create);
router.get("/getPosts",getPosts)
router.delete("/delete/:postId/:userId",verifyToken,deletePost)
export default router;