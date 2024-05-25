import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.mjs"
import userRoute from "./routes/user.route.mjs"
import cors from "cors"
import postRoute from "./routes/post.route.mjs"
import newsRoute from "./routes/news.route.mjs"
import commentRoute from "./routes/comment.route.mjs"
const app=express();
app.use(express.json())
dotenv.config()
app.use(cors());
mongoose.connect(process.env.MONGO)

app.use("/api/test",userRoute);
app.use("/api/user",authRoute);
app.use("/api/create",postRoute)
app.use("/api/tech",newsRoute)
app.use("/api/comment",commentRoute)

//middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal Server Error"
    res.status(statusCode).send({
        message,
        statusCode,
        success:false
    })
})

app.listen(3500)