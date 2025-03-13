const mongoose =require("mongoose");
const bcrypt =require("bcryptjs");
const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});
userschema.pre("save",async function (next) {
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});
const user = mongoose.model("client",userschema);
module.exports=user;