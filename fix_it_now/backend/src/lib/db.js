import mongoose from "mongoose";

export const connectDb = async(req,res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo db connected");
    }catch(err){
        console.log("error connecting db",err.message);
        process.exit(1);
    }
};