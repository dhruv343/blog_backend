import express from "express";
import { addComment,getComments,likeComment,editComment,deleteComment,getcomments} from "../controllers/comment.controller.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";

const router=express.Router();

router.post("/addcomment",verifyToken,addComment);
router.get("/getAllComments/:postId",getComments)
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getcomments', verifyToken, getcomments);
export default router;