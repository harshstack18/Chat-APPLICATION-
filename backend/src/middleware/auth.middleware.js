import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message : "Unauthorized - No Token Provider"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log('Decoded token:', decoded); // Debug decoded content

        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid Token"});
        }
        console.log(`Looking for user with ID: ${decoded.userId}`); // Debug user ID
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            console.log(`No user found with ID: ${decoded.userId}`); // Debug missing user
            return res.status(404).json({message: "User not found"});
        }
        req.user = user
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};