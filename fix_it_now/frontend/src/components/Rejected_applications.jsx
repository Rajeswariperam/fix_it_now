import axios from "axios";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
function Rejected_applications(){
    const token=localStorage.getItem('token');
    const [searchQuery,setSearchQuery]=useState("");
    const [getRejectedWorkers,setgetRejectedWorkers]=useState([]);
    const display_rejected_applications=async(e)=>{
        try{
            const res=await axios.get('http://localhost:3000/api/admin/rejected_applications',{
                headers:{Authorization:`Bearer ${token}`}
            });
            setgetRejectedWorkers(res.data.getRejectedWorkers);
        }catch(err){
            console.log(err.message);
        }
    }
    const accept_job_application=async(requestId)=>{
        try{
            const res=await axios.post('http://localhost:3000/api/admin/accept_application',{requestId},{
                headers:{Authorization:`Bearer ${token}`}
            })
            toast.success("JOB application accepted");
            display_rejected_applications();
        }catch(err){
            console.log("failed to accept job");
        }
    }
        const search_bar = async (query) => {
            if (!query) {
                display_rejected_applications();
            return;
            }
            try {
            const res = await axios.get("http://localhost:3000/api/admin/search_job_rejected", {
                params: { searchQuery: query },
                headers: { Authorization: `Bearer ${token}` },
            });
            setgetRejectedWorkers(res.data.getAcceptedWorkers || []);
            } catch (err) {
            console.log("No search result found");
            setgetRejectedWorkers([]);
            }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
        search_bar(searchQuery.toLowerCase());
        }, 200); 
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    useEffect(()=>{
        display_rejected_applications();
    },[]);
    return(
        <>
            <div className="container">
            <h2 className="mb-4 text-center mt-2">Rejected applications</h2>
            <hr></hr>
            <div className="d-flex justify-content-center">
            <input
                type="text"
                className="form-control w-50 mb-2 shadow-lg"
                style={{ borderRadius: "20px" }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
            <div className="table-responsive shadow-lg p-3 mb-5 bg-body rounded text-center">
                <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Job Name</th>
                    <th>Status</th>
                    <th>Accept application</th>
                    </tr>
                </thead>
                <tbody>
                    {getRejectedWorkers?.length > 0 ? (
                    getRejectedWorkers.map((requests, index) => (
                        <tr key={requests._id || index}>
                        <td>{index + 1}</td>
                        <td><Link to='/user_profile' state={{userId:requests.userId._id,show_review:false }}>{requests.userId.fullName}</Link></td>
                        <td>{requests.job}</td>
                        <td style={{color:"red"}}>
                            Rejected
                        </td>
                        <td>
                            <button className="btn btn-success ms-2" onClick={()=>accept_job_application(requests._id)}>Accept</button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="5" className="text-center">
                        NO JOBS AVAILABLE
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
            <ToastContainer position="top-right" autoClose={1000}/>
        </>
    )
}
export default Rejected_applications;