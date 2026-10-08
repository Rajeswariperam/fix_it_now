import User from "../Models/User.js";
import Worker from "../Models/Worker.js";
import Booking from "../Models/Booking.js";
import mongoose from "mongoose";

export const display_pending_jobs = async(req,res)=>{
    try{
        const pendingRequests=await Worker.find({jobAccepted:false,jobRejected:false})
        .populate("userId","fullName");
        if(pendingRequests.length>0){
            return res.status(200).json({pendingRequests});
        }
        return res.status(200).json({message:"no pending requests"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};


export const accept_application=async(req,res)=>{
    try{
        const {requestId}=req.body;
        const approved=await Worker.findById(requestId);
        if(!approved){
            return res.status(404).json({message:"failed to fetch details"});
        }
        approved.jobAccepted=true,
        approved.jobRejected=false
        await approved.save();
        return res.status(200).json({message:"job Application verififed"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const reject_application=async(req,res)=>{
    try{
        const {requestId}=req.body;
        const rejected=await Worker.findById(requestId);
        if(!rejected){
            return res.status(404).json({message:"failed to reject"});
        }
        rejected.jobAccepted=false,
        rejected.jobRejected=true
        await rejected.save();
        return res.status(200).json({message:"application rejecetd"})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const accepted_applications = async(req,res)=>{
    try{
        const getAcceptedWorkers=await Worker.find({jobAccepted:true,jobRejected:false}).populate("userId","fullName");
        if(getAcceptedWorkers.length>0){
            return res.status(200).json({getAcceptedWorkers});
        }
        return res.status(200).json({message:"List is emoty"})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const rejected_applications = async(req,res)=>{
    try{
        const getRejectedWorkers=await Worker.find({jobAccepted:false,jobRejected:true}).populate("userId","fullName");
        if(getRejectedWorkers.length>0){
            return res.status(200).json({getRejectedWorkers});
        }
        return res.status(200).json({message:"List is emoty"})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};


export const view_user_profile = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("Fetching profile for userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userdata = await User.findById(userId);
    if (!userdata) {
      return res.status(404).json({ message: "No user found" });
    }
    const isClient = userdata.role?.toLowerCase() === 'client';
    const baseQuery = {
      $or: [
        { workerId: userId },
        { clientId: userId }
      ],
      jobAcceptedByWorker: true,
      jobRejectedByWorker: false,
    };
    const populateOptions = isClient
      ? [
          { path: "jobId", select: "job jobDescription" },
          { path: "workerId", select: "fullName email profilePic" }
        ]
      : [
          { path: "jobId", select: "job jobDescription" },
          { path: "clientId", select: "fullName email profilePic" }
        ];

    const bookings = await Booking.find(baseQuery)
      .populate(populateOptions)
      .lean();

    return res.status(200).json({
      message: "User profile fetched successfully",
      userdata,
      bookings: bookings.length > 0 ? bookings : [],
    });
  } catch (err) {
    console.error("Backend error in view_user_profile:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const search_job_accepted = async(req,res)=>{
    try{
        const {searchQuery}=req.query;
        if(!searchQuery){
            return res.status(202).json({message:"error"});
        }
        const getAcceptedWorkers=await Worker.find({
            job:{ $regex: `.*${searchQuery}.*`, $options: "i" } ,
            jobAccepted:true,
            jobRejected:false
        }).populate("userId","fullName");
        if(getAcceptedWorkers.length>0){
            return res.status(200).json({getAcceptedWorkers});
        }
        return res.status(200).json({message:"no match found",getAcceptedWorkers:[]})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const  search_job_rejected= async(req,res)=>{
    try{
        const {searchQuery}=req.query;
        if(!searchQuery){
            return res.status(202).json({message:"error"});
        }
        const getAcceptedWorkers=await Worker.find({
            job:{ $regex: `.*${searchQuery}.*`, $options: "i" } ,
            jobAccepted:false,
            jobRejected:true
        }).populate("userId","fullName");
        if(getAcceptedWorkers.length>0){
            return res.status(200).json({getAcceptedWorkers});
        }
        return res.status(200).json({message:"no match found",getAcceptedWorkers:[]})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const  search_job_pending= async(req,res)=>{
    try{
        const {searchQuery}=req.query;
        if(!searchQuery){
            return res.status(202).json({message:"error"});
        }
        const getAcceptedWorkers=await Worker.find({
            job:{ $regex: `.*${searchQuery}.*`, $options: "i" } ,
            jobAccepted:false,
            jobRejected:false
        }).populate("userId","fullName");
        if(getAcceptedWorkers.length>0){
            return res.status(200).json({getAcceptedWorkers});
        }
        return res.status(200).json({message:"no match found",getAcceptedWorkers:[]})
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const worker_info = async (req, res) => {
  try {
    const workerInfo = await User.find({ role: 'worker' });
    
    if (workerInfo.length === 0) {
      return res.status(200).json({ message: "No workers found" });
    }
    return res.status(200).json({ workerInfo });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const client_info = async (req, res) => {
  try {
    const workerInfo = await User.find({ role: 'client' });
    
    if (workerInfo.length === 0) {
      return res.status(200).json({ message: "No clients found" });
    }
    return res.status(200).json({ workerInfo });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const get_booking_form = async (req, res) => {
    try {
        const { jobId } = req.params;
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid or missing ID in the request path." });
        }

        let bookingdata;
        bookingdata = await Booking.findById(jobId)
            .populate("clientId", "fullName email Street mandal district state country pinCode")
            .populate("workerId", "fullName email Street mandal district state country pinCode")
            .populate("jobId", "job");
        if (!bookingdata) {
            const bookingInfo = await Booking.find({ jobId: jobId })
                .populate("clientId", "fullName email Street mandal district state country pinCode")
                .populate("workerId", "fullName email Street mandal district state country pinCode")
                .populate("jobId", "job");
            if (bookingInfo.length === 0) { 
                return res.status(404).json({ message: "No booking data found matching the provided ID." });
            }
            bookingdata = bookingInfo;
        }
        return res.status(200).json({ bookingdata });

    } catch (err) {
        console.error("Backend error in get_booking_form:", err);
        return res.status(500).json({ message: "Server error during booking retrieval.", error: err.message });
    }
};

export const deactivateAccount=async(req,res)=>{
    try{
        const {userId}=req.params;
        const succesfull=await User.findById(userId);
          if (!succesfull.isActive) {
            return res.status(400).json({ message: "Account already deactivated" });
            }
        if(succesfull){
            succesfull.isActive=false;
            await succesfull.save();
            return res.status(200).json({message:"succesfull1"});
        }
        return res.status(404).json({message:"failed to fetch"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

export const activateAccount=async(req,res)=>{
    try{
        const {userId}=req.params;
        const succesfull=await User.findById(userId);
          if (succesfull.isActive) {
            return res.status(400).json({ message: "Account is active" });
            }
        if(succesfull){
            succesfull.isActive=true;
            await succesfull.save();
            return res.status(200).json({message:"succesfull1"});
        }
        return res.status(404).json({message:"failed to fetch"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};