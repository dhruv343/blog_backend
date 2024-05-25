import express from "express";
import { getUsers,updateUser,deleteUser,getUser} from "../controllers/user.controller.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";

const router=express.Router();



router.put("/updateUser/:id",verifyToken,updateUser);

router.delete("/deleteUser/:id",verifyToken,deleteUser)

router.get("/getUsers",verifyToken,getUsers)

router.get('/:userId', getUser);

export default router;