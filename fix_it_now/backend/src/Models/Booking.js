import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    review:{
      type:String,
      default:"",
    },
    jobCompleted:{
      type:Boolean,
    },
    jobAcceptedByWorker:{
      type:Boolean,
    },
    jobRejectedByWorker:{
      type:Boolean,
    },
    rating:{
      type:Number,
      min:1,
      max:5,
    },
    slotDate: {
      type: Date,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
