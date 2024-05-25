import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    category:{
      type:String,
      required:true,
      default:"uncategorized"
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

const post=mongoose.model("posts",postSchema);
export default post;