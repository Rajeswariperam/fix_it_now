import { useState,useEffect } from "react";
import axios from "axios";
function Rejected_worker_jobs(){
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
        <div className="container">
          <h2 className="mb-4 text-center mt-2">Rejected Job Applications</h2>
          <div className="table-responsive shadow-lg p-3 mb-5 bg-body rounded text-center">
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
                {appData?.length > 0 ? (
                  appData
                  .filter(app => app.jobAccepted === false && app.jobRejected === true)
                  .map((app, index) => (
                    <tr key={app._id || index}>
                      <td>{index + 1}</td>
                      <td>{userData?.fullName}</td>
                      <td>{app.job}</td>
                      <td style={{color:'red'}}>
                        Rejected
                      </td>
                      <td>
                        <button className="btn btn-danger" onClick={()=>delete_application(app._id)}>X</button>
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
        </>
    )
}
export default Rejected_worker_jobs;