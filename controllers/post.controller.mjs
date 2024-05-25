import { errorHandler } from "../utils/error.mjs"
import postModel from "../db/post.model.mjs"

export const create = async (req, res, next) => {

    if (!req.user.isAdmin) {
        next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if (!req.body.title || !req.body.content) {
        next(errorHandler(400, "Please enter all the required fields"))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const newPost = new postModel({
        ...req.body,
        slug: slug,
        userId: req.user.id
    })
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const posts = await postModel.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await postModel.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await postModel.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    }
    catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id!=req.params.userId) {
        next(errorHandler(403, "You are not allowed to delete the post"))
    }
    try {

        const deletedPost=await postModel.findByIdAndDelete(req.params.postId);
        if(deletedPost){
        res.status(200).json("Post successfully deleted")
        }
    } catch (error) {
        next(error)
    }
}