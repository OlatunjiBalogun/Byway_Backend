const mongoose =require("mongoose");
const bcrypt =require("bcryptjs");
const userschema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique: true,
    },
    email:{
        type:String,
        require:true,
        unique: true,
    },
    firstname:{
        type:String,
        require:true,
    },
    lastname:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    }
});
userschema.pre("save",async function (next) {
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});
const user = mongoose.model("client",userschema);
module.exports=user;