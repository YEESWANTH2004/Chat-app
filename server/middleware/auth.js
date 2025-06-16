
import jwt from "jsonwebtoken";
import User from "../models/User";

//Middleware to check if the user is authenticated

export const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
}

// Middleware to check if the user is an admin

export const checkAuth = (req,res) =>{
  res.json({
    success: true,
    user: req.user,
    message: "User is authenticated"
  });
}