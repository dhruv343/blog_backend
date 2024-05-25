import express from "express";
import { news} from "../controllers/news.controller.mjs";

const router=express.Router();

router.get("/news",news)
export default router;