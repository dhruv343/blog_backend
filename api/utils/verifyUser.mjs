import jwt from 'jsonwebtoken';
import { errorHandler } from './error.mjs';

// export const verifyToken=(req,res,next)=>{

//     const token=req.cookies.access_token;

//     if(!token){
//         next(errorHandler(401,"Unauthorized and no token"));
//     }

//     jwt.verify(token,process.env.JWT_SECRETKEY,(err,user)=>{
//         if(err){
//             next(errorHandler(401,"Unauthorized"));
//         }
//         req.user=user;
//         next();
//     })

// }

export const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
            if (err) {
                next(errorHandler(401, "Unauthorized"));
            }
            else {
                req.user=user;
                // console.log(user);
                next();
            }
        })
    }
    else {
        next(errorHandler(401, "No token sent"));
    }

}