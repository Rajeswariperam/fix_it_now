import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/glass.css";

function View_worker_application() {
  const location = useLocation();
  const { jobId } = location.state || {};
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) return;

    const fetchWorkerData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/worker/particular_worker_detail/${jobId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(res.data.userData);
        setAppData(res.data.appData);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [jobId, token]);

  if (!jobId) return <p className="text-center mt-5">No job selected.</p>;
  if (loading) return <p className="text-center mt-5">Loading worker application...</p>;
  if (!appData || !userData) return <p className="text-center mt-5">Worker or application data not found.</p>;

  return (
    <motion.div 
      className="container mt-5 pb-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="row gy-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
            }}
          >
            <motion.div className="position-relative">
              <motion.img
                src={userData.profilePic || '/tools.avif'}
                alt={userData.fullName}
                style={{ 
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="glass-overlay"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '2rem 1rem 1rem'
                }}
              >
                <motion.h3 
                  className="text-white mb-1"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {userData.fullName}
                </motion.h3>
                <motion.p 
                  className="text-light mb-0"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {userData.district}, {userData.state}
                </motion.p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="p-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-muted mb-3">{userData.role}</p>
              <motion.button 
                className="btn btn-outline-primary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/user_profile', { state: { userId: userData._id, show_review: false } })}
                style={{
                  borderRadius: '30px',
                  padding: '12px 30px'
                }}
              >
                View Full Profile
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="col-md-7"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="glass-card p-4 h-100"
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
              Service Details
            </motion.h3>

            <motion.div 
              className="mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="form-label text-muted mb-2">Service Type</label>
              <div 
                className="form-control-lg bg-light rounded-pill px-4 py-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {appData.job}
              </div>
            </motion.div>

            <motion.div 
              className="mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="form-label text-muted mb-2">Description</label>
              <div 
                className="form-control bg-light rounded p-3"
                style={{
                  minHeight: '100px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {appData.jobDescription}
              </div>
            </motion.div>

            <motion.div 
              className="mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h5 className="mb-3" style={{ color: '#2c3e50' }}>Contact Details</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <motion.div 
                    className="p-3 rounded"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="text-muted small">Email</div>
                    <div>{userData.email}</div>
                  </motion.div>
                </div>
                <div className="col-md-6">
                  <motion.div 
                    className="p-3 rounded"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="text-muted small">Mobile</div>
                    <div>{userData.mobileNum}</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="d-flex justify-content-center mt-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link 
                  className="btn btn-success btn-lg px-5"
                  state={{ jobId }}
                  to={'/book_slot'}
                  style={{
                    background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '12px 40px',
                    boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
                  }}
                >
                  Hire Now
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default View_worker_application;
