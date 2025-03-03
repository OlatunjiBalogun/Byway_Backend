const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async function(req, res) {
    try {
        const { username, firstname, lastname, email, password } = req.body;
        
        // Validate required fields
        if (!username || !firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: "Email already exists" });
            } else {
                return res.status(409).json({ message: "Username already exists" });
            }
        }
        
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user with hashed password
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error signing up user" });
    }
};

const login = async function (req, res) {
    try {
        const { username, email, password } = req.body;
        
        // Check if either username/email and password are provided
        if ((!email && !username) || !password) {
            return res.status(400).json({ message: "Please provide username/email and password" });
        }
        
        // Find user by username or email
        const existingUser = await User.findOne({
            $or: [
                { email: email || "" },
                { username: username || "" }
            ],
        });
        
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Compare passwords
        const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
        if (!isCorrectPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                userId: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        
        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                email: existingUser.email,
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in user" });
    }
};

module.exports = { signup, login };