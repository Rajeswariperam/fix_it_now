import { useEffect,useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/glass.css";

function Pending_worker_jobs(){
    const [appData, setAppData] = useState([]);
    const [userData, setUserData] = useState(null);
    const token=localStorage.getItem('token');
    const display_applyed_jobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/worker/display_accepted_jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.userData);
      setAppData(res.data.appData);
    } catch (err) {
      alert(err.message);
    }
  };
  const delete_application=async(appId)=>{
    try{
      const res=await axios.delete(`http://localhost:3000/api/worker/delete_application/${appId}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      console.log(res.data.message);
      display_applyed_jobs();
    }catch(err){
      console.log(err.message);
    }
  };
  useEffect(()=>{
    display_applyed_jobs();
  },[]);
    return(
        <>
  <motion.div className="container py-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <motion.h2 className="mb-4 text-center mt-2" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>Yet to be accepted by Admin</motion.h2>
          <motion.div className="glass-card p-3 mb-5 bg-body rounded text-center" initial={{ scale: 0.995 }} whileHover={{ scale: 1.01 }}>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Job Name</th>
                    <th>Status</th>
                    <th>Delete?</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                  {appData?.length > 0 ? (
                    appData
                     .filter(app => app.jobAccepted === false && app.jobRejected === false)
                    .map((app, index) => (
                      <motion.tr key={app._id || index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                        <td>{index + 1}</td>
                        <td>{userData?.fullName}</td>
                        <td>{app.job}</td>
                        <td style={{color:"orange"}}>
                              Pending
                        </td>
                        <td>
                          <button className="btn btn-danger" onClick={()=>delete_application(app._id)}>X</button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        NO JOBS AVAILABLE
                      </td>
                    </tr>
                  )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
        </>
    )
}

export default Pending_worker_jobs;