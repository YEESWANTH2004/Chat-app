import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';
import {io, userSocketMap} from '../server.js'; // Adjust the import path as necessary
//Sign up a new user

export const signUp = async (req, res) => {
  const { email, fullname, password, bio } = req.body;

  try{
    if(!email || !fullname || !password || !bio) {
      return res.json({success: false, message: "Missing Details"});
    }
    const user = await User.findOne({ email });
    if(user) {
      return res.json({success: false, message: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User.create({
      email,
      fullname,
      password: hashedPassword,
      bio
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData:newUser,
      token,
    message: "User created successfully"
    });

  }catch (error){
    console.log(error.message);
    res.json({
      success: false,
    message: error.message
    });
  }
}

export const login = async (req, res) => {
  try {
     const { email,password} = req.body;
     const userData = await User.findOne({ email });

     const isPasswordValid = await bcrypt.compare(password, userData.password);

     if(!isPasswordValid){
        return res.json({
          success: false,
          message: "Invalid email or password"
        });
     }

      const token = generateToken(userData._id);
      res.json({
        success: true,
        userData,
        token,
        message: "Login successful"
      });

  } catch (error) {

    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
    
  }
}

export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "User is authenticated"
  });
} 

//Controller to update user profile
export const updateProfile = async (req, res) => {


  try {
      const { fullname, bio, profilePic } = req.body;
      const userId = req.user._id;
      let updatedUser;

      if(!profilePic){
       updatedUser =  await User.findByIdAndUpdate(userId, {
          fullname,
          bio
        }, { new: true });
      }
      else{
        const upload = await cloudinary.uploader.upload(profilePic);

        updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, fullname, bio}, { new: true });
      }
  
      res.json({
        success: true,
        user: updatedUser,
        message: "Profile updated successfully"
      });


  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}