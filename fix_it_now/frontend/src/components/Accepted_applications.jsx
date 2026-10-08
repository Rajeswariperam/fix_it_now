import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

function Accepted_applications() {
  const token = localStorage.getItem("token");
  const [getAcceptedWorkers, setgetAcceptedWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const display_accepted_applications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/accepted_applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setgetAcceptedWorkers(res.data.getAcceptedWorkers);
    } catch (err) {
      console.log(err.message);
    }
  };
  const reject_job_application = async (requestId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/admin/reject_application",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application rejected");
      setTimeout(() => {
        display_accepted_applications();
      }, 400);
    } catch (err) {
      console.log("Failed to reject");
    }
  };
  const search_bar = async (query) => {
    if (!query) {
      display_accepted_applications();
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/api/admin/search_job_accepted", {
        params: { searchQuery: query },
        headers: { Authorization: `Bearer ${token}` },
      });
      setgetAcceptedWorkers(res.data.getAcceptedWorkers || []);
    } catch (err) {
      console.log("No search result found");
      setgetAcceptedWorkers([]);
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      search_bar(searchQuery.toLowerCase());
    }, 200); 
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  
  useEffect(() => {
    display_accepted_applications();
  }, []);

  return (
    <>
      <div className="container">
        <h2 className="mb-4 text-center mt-2">Accepted Applications</h2>
        <hr />
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
                <th>Reject Application</th>
              </tr>
            </thead>
            <tbody>
              {getAcceptedWorkers?.length > 0 ? (
                getAcceptedWorkers.map((requests, index) => (
                  <tr key={requests._id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <Link
                        to="/user_profile"
                        state={{ userId: requests.userId._id,show_review:false  }}
                      >
                        {requests.userId.fullName}
                      </Link>
                    </td>
                    <td>{requests.job}</td>
                    <td style={{color:"green"}}>Accepted</td>
                    <td>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => reject_job_application(requests._id)}
                      >
                        Reject
                      </button>
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
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
}

export default Accepted_applications;
