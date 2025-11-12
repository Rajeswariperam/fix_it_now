import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import "../styles/glass.css";


function Apply_for_job(){
    const navigate=useNavigate();
    const [formdata,setFormData]=useState({
            job:"",
            jobDescription:""
        });
    const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
    };
    const update_worker_info= async(e)=>{
        e.preventDefault();
        try{
            const token=localStorage.getItem("token");
            await axios.post("http://localhost:3000/api/worker/create",formdata,{
                headers:{Authorization:`Bearer ${token}`}}
            );
            alert("Application created");
            setTimeout(()=>{
                navigate('/');
            },1500);
        }catch(err){
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Failed to create application';
            alert(msg);
        }
    }
    return(
        <>
    <motion.div className="d-flex justify-content-center align-items-center py-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <motion.div className="glass-card p-4" style={{ maxWidth: 600, width: '100%' }} initial={{ scale: 0.99 }} whileHover={{ scale: 1.01 }}>
            <form onSubmit={update_worker_info}>
            <h3 className="text-center mb-4">Job Application</h3>

            <input
                type="text"
                name="job"
                value={formdata.job}
                onChange={handleChange}
                placeholder="Enter job name"
                className="form-control form-control-lg mb-3 glass-input"
            />

            <textarea
                name="jobDescription"
                value={formdata.jobDescription}
                onChange={handleChange}
                placeholder="Job description"
                className="form-control form-control-lg mb-3 glass-input"
                rows={5}
            />

            <div className="d-flex gap-2">
              <button type="submit" className="btn gradient-btn w-100">
                  Create Application
              </button>
              <button type="button" className="btn btn-outline-secondary w-25" onClick={()=>navigate(-1)}>Back</button>
            </div>
            </form>
        </motion.div>
        </motion.div>
        </>
    )
}

export default Apply_for_job;