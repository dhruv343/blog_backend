import userModel from "../db/user.model.mjs";
import { errorHandler } from "../utils/error.mjs";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";


export const updateUser = async (req, res, next) => {
    
    
    if (req.params.id !== req.user.id) {
        return next(errorHandler(403, "You are not allowed to update this user"));
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(
                errorHandler(400, 'Username must be between 7 and 20 characters')
            );
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'));
        }

        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(400, 'Username can only contain letters and numbers')
            );
        }

    }

    try {


        let result = await userModel.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            }
        }, { new: true })


       const { password, ...rest } = result._doc;

       jwt.sign({ id: result._id, isAdmin: result.isAdmin }, process.env.JWT_SECRETKEY, (err, token) => {
        if (err) {
          next(errorHandler(400, "something went wrong"));
        }
        else {
          res.json({ user: rest, auth: token });
        }
       });

    } catch (error) {
        next(error);
    }


} 


export const deleteUser=async(req,res,next)=>{
    
    if(!req.user.isAdmin){
    if (req.params.id != req.user.id) {
        return next(errorHandler(403, "You are not allowed to delete this user"));
    }
    }
    try {

    await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json("User successfully deleted")
    } catch (error) {
        next(error)
    }
}


export const getUsers=async(req,res,next)=>{

    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
      }
      try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    
        const users = await userModel.find()
          .sort({ createdAt: sortDirection })
          .skip(startIndex)
          .limit(limit);
    
        const usersWithoutPassword = users.map((user) => {
          const { password, ...rest } = user._doc;
          return rest;
        });
    
        const totalUsers = await userModel.countDocuments();
    
        const now = new Date();
    
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthUsers = await userModel.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
    
        res.status(200).json({
          users: usersWithoutPassword,
          totalUsers,
          lastMonthUsers,
        });
      } catch (error) {
        next(error);
      }



}


export const getUser = async (req, res, next) => {
    try {
      const user = await userModel.findById(req.params.userId);
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };