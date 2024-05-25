import express from "express"
import { signup ,signin,googleLogin} from "../controllers/auth.controller.mjs";

const router=express.Router();

router.post("/auth",signup) 
router.post("/authlogin",signin)
router.post("/google",googleLogin)


export default router;  