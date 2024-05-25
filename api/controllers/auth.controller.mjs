import userModel from "../db/user.model.mjs"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.mjs"
import jwt from "jsonwebtoken";



export const signup = async (req, res, next) => {

  const { username, email, password } = req.body;
  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "all fields are required"));
  }
  const hashedpass = bcryptjs.hashSync(password, 10);
  try {
    let user = new userModel({ username, email, password: hashedpass })
    let result = await user.save();
    result = result.toObject()
    delete result.password
    res.send(result);
  } catch (error) {
    next(error);
  }
}






export const signin = async (req, res, next) => {

  const { email, password } = req.body
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "all fields are required"));
  }


  try {

    let user = await userModel.findOne({ email });

    if (user) {
      const validPassword = bcryptjs.compareSync(password, user.password);

      if (validPassword) {

        const { password: pass, ...rest } = user._doc
        
        // res.send(rest);
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY);
        // res.status(200).cookie('access_token', token, {
        //   httpOnly: true
        // }).json(rest)


        jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRETKEY, (err, token) => {
          if (err) {
            next(errorHandler(400, "something went wrong"));
          }
          else {
            res.json({ user: rest, auth: token });
          }
        });


      }
      else {
        next(errorHandler(400, "Invalid details"));
      }

    }
    else {
      next(errorHandler(400, "Invalid details"));
    }


  }
  catch (error) {
    next(error);
  }
}







export const googleLogin = async (req, res, next) => {
  const { email, name, photoUrl } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (user) {

      const { password, ...rest } = user._doc;
      // const token = jwt.sign(
      //   { id: user._id },
      //   process.env.JWT_SECRETKEY
      // );
      
      // res
      //   .status(200)
      //   .cookie('access_token', token, {
      //     httpOnly: true,
      //   })
      //   .json(rest);

      jwt.sign({ id: user._id ,isAdmin:user.isAdmin }, process.env.JWT_SECRETKEY,(err,token)=>{
        if(err){
          next(errorHandler(400, "something went wrong"));
        }
        else{
         res.json({user:rest,auth:token});
        }
     });

    }
    else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new userModel({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: photoUrl,
      });
      await newUser.save();
      const { password, ...rest } = newUser._doc;

      // const token = jwt.sign(
      //   { id: newUser._id },
      //   process.env.JWT_SECRETKEY
      // );

      // res
      //   .status(200)
      //   .cookie('access_token', token, {
      //     httpOnly: true,
      //   })
      //   .json(rest);


      jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRETKEY, (err, token) => {
        if (err) {
          next(errorHandler(400, "something went wrong"));
        }
        else {
          res.json({ user: rest, auth: token });
        }
      });

    }
  }
  catch (error) {
    next(error);
  }

}



