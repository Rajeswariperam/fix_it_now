import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/glass.css";

function Book_slot() {
  const navigate=useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || "";
  const token = localStorage.getItem("token");

  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  const timeSlots = ["9 A.M - 12 A.M", "12 A.M - 3 P.M", "3 P.M - 6 P.M", "6 P.M - 9 P.M"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slotDate || !slotTime) {
      toast.warn("Please select both date and time slot");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/booking/create",
        { jobId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Slot booked successfully!");
      console.log(res.data);
      setTimeout(()=>{
        navigate('/pending_requests');
      },1500);
    } catch (err) {
      console.log(err);
      toast.error("worker is already booked by someone");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mt-5"
    >
      <div className="row g-4">
        <motion.div 
          className="col-md-5"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="glass-card h-100 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <motion.img 
              src="/tools.avif" 
              alt="service" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="col-md-7"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="glass-card p-4"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
            }}
          >
            <motion.h3 
              className="mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ 
                color: '#2c3e50',
                fontSize: '2rem',
                fontWeight: '600'
              }}
            >
              Book a Slot
            </motion.h3>
            
            <form onSubmit={handleSubmit}>
              <motion.div 
                className="mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="form-label text-muted mb-2">Select Date</label>
                <motion.input
                  type="date"
                  className="form-control form-control-lg"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    padding: '12px 20px'
                  }}
                />
              </motion.div>

              <motion.div 
                className="mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label className="form-label text-muted mb-2">Select Time Slot</label>
                <motion.select
                  className="form-select form-select-lg"
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    padding: '12px 20px'
                  }}
                >
                  <option value="">-- Select Time Slot --</option>
                  {timeSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div 
                className="d-flex justify-content-between align-items-center mt-5"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button 
                  type="submit" 
                  className="btn btn-success btn-lg px-5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '12px 40px',
                    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
                  }}
                >
                  Book Slot
                </motion.button>
                <motion.button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  style={{
                    borderRadius: '30px',
                    padding: '12px 30px'
                  }}
                >
                  Back
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer position="top-right" autoClose={1000}/>
    </motion.div>
  );
}
export default Book_slot;
