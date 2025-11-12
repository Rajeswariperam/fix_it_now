import Booking from "../Models/Booking.js";
import Worker from "../Models/Worker.js";

export const create = async (req, res) => {
  try {
    const { jobId, slotDate, slotTime } = req.body;
    const clientId = req.user._id;
    const worker = await Worker.findById(jobId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    const workerId = worker.userId;
    if (!jobId || !slotDate || !slotTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const job_already_booked = await Booking.findOne({workerId,slotDate,slotTime});
    if (job_already_booked) {
      return res.status(400).json({ message: "Slot already booked by someone else" });
    }
    const book_job = new Booking({jobId,workerId,clientId,slotDate,slotTime,jobCompleted:false,jobAcceptedByWorker:false,jobRejectedByWorker:false});
    await book_job.save();
    return res.status(201).json({ message: "Slot booked successfully", book_job });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const get_recruited_staff = async (req, res) => {
  try {
    const clientId = req.user._id;
    if (!clientId) {
      return res.status(400).json({ message: "Invalid client" });
    }
    const fetch_recruited_list = await Booking.find({ clientId,jobCompleted:false})
      .populate("workerId", "fullName isActive") 
      .populate("jobId","job")
      .sort({createdAt:-1}); 
    if (fetch_recruited_list.length > 0) {
      return res
        .status(200)
        .json({ message: "Fetched successfully", formData: fetch_recruited_list });
    }
    return res.status(200).json({ message: "List is empty", FormData: [] });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const get_job_offer = async (req, res) => {
  try {
    const workerId = req.user._id;

    if (!workerId) {
      return res.status(400).json({ message: "Worker ID missing" });
    }

    const jobOffers = await Booking.find({ workerId ,jobCompleted:false })
      .populate("clientId", "fullName profilePic Street mandal district state country pinCode")
      .populate("jobId", "job");

    if (!jobOffers || jobOffers.length === 0) {
      return res.status(404).json({ message: "No job offers found" });
    }

    return res.status(200).json({ jobOffers });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const accept_job=async(req,res)=>{
  try{
    const {bookingId}=req.params;
    if(!bookingId){
      return res.status(404).json({message:"try again"});
    }
    const get_job_info=await Booking.findById({_id:bookingId});
    get_job_info.jobAcceptedByWorker=true;
    get_job_info.jobRejectedByWorker=false;
    await get_job_info.save();
    return res.status(200).json({message:"job Accepted"});
  }catch(err){
    return res.status(500).json({message:err.message});
  }
};

export const reject_job=async(req,res)=>{
  try{
    const {bookingId}=req.params;
    if(!bookingId){
      return res.status(404).json({message:"try again"});
    }
    const get_job_info=await Booking.findById({_id:bookingId});
    get_job_info.jobAcceptedByWorker=false;
    get_job_info.jobRejectedByWorker=true;
    await get_job_info.save();
    return res.status(200).json({message:"job Accepted"});
  }catch(err){
    return res.status(500).json({message:err.message});
  }
};

export const delete_application=async(req,res)=>{
  try{
    const {booking_id}=req.params;
    if(!booking_id){
      return res.status(404).json({message:"please try later"});
    }
    const deleted=await Booking.findByIdAndDelete(booking_id);
    if(deleted){
      return res.status(200).json({message:"deleted succesfully"});
    }
    return res.status(404).json({message:"problem while deleting"});
  }catch(err){
    return res.status(500).json({message:err.message});
  }
};


export const get_completed_jobs=async(req,res)=>{
  try{
    const workerId=req.user._id;
    if(!workerId){
      return res.status(404).json({message:"unable to fetch details"});
    }
    const jobOffers = await Booking.find({ workerId:workerId,jobCompleted:true })
      .populate("clientId", "fullName profilePic Street mandal district state country pinCode")
      .populate("jobId", "job");
      if(jobOffers.length===0){
        return res.status(200).json({message:"no data found",jobOffers:[]});
      }
      return res.status(200).json({jobOffers});
  }catch(err)
  {
    return res.status(500).json({message:err.message});
  }
}

export const update_completed_jobs = async (req, res) => {
  try {
    const now = new Date();

    const result = await Booking.updateMany(
      { jobCompleted: false, slotDate: { $lt: now } },
      { $set: { jobCompleted: true } }
    );

    console.log(`✅ Auto-marked ${result.modifiedCount} jobs as completed`);
    if (res) {
      return res.status(200).json({
        message: "Updated old jobs",
        result,
      });
    }
    return result;
  } catch (err) {
    console.error("❌ Error updating jobs:", err.message);

    if (res) {
      return res.status(500).json({ message: err.message });
    }
    throw err; 
  }
};

