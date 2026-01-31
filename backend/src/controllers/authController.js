import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";


//Json web token Generation and cookie setting
const generateToken = (res,userId) => {
    const  token = jwt.sign({ userId },process.env.JWT_SECRET_KEY,{ expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,     
        secure: process.env.NODE_ENV === "production",      // production me true
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    return token;
}


// Register a new user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required",success:false });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists",success:false });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", success:true,
            newUser:{
                user:newUser.username,
                email:newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message, success:false });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required",success:false });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials",success:false });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials",success:false });
        }
    
        // Create JWT token
        const token = generateToken(res,user._id.toString());
        res.status(200).json({message: "Login user successfully",success:true,
            user:{
                user:user.username,
                email:user.email
            }
         });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message, success:false });
    }
}; 

export const logout = (req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"Logout successfully",success:true});
    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message , success:false });
    }
}

export const getMe = async (req, res) => {
  try {
    // authMiddleware se aaya hua userId
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
