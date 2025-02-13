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
app.use(cors());

//ensure that express can read json
app.use(express.json());
const rateLimiter = limiter({
    windowMs: 30 * 60 * 1000,
    max: 50,
    message: "please try again in 30mins"
});
app.use("/byway",rateLimiter);
app.use("/byway",authroutes);
app.use(errorHandler);

//Mongo db connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.log("Mongo Db Error:", error);
});

// Start node js server
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
