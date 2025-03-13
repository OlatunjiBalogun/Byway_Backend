// Bring down Packages installed
require("dotenv").config();
const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const authroutes= require("./routes/authrouthes");
const limiter = require("express-rate-limit");
const errorHandler = require("./Validation/middleware/errorhandler");
// Initialize a express app
const app = express();

//Configure middlewares
app.use(cors({
    origin: "*",
    credentials: true  // Note: should be lowercase
}));

//ensure that express can read json
app.use(express.json());
const rateLimiter = limiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});
app.use("/byway",rateLimiter);
app.use("/byway",authroutes);
app.use(errorHandler);

//Mongo db connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB');
        
        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
connectDB();
module.exports=app;
