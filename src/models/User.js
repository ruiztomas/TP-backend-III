import mongoose, { mongo } from "mongoose";

const userSchema=new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum:["user", "admin"],
        required: true
    },
    pets:{
        type: Array,
        default: []
    }
},{timestamps: true});

const UserModel=mongoose.model("User", userSchema);
export default UserModel;