import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Pending_requests() {
  const [formData, setFormData] = useState([]);
  const token = localStorage.getItem("token");

  const fetch_all_jobs_recruited_by_client = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/booking/get_recruited_staff",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      setFormData(res.data.formData || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  const delete_pending_app = async (booking_id) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/booking/delete_application/${booking_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Application deleted");
      fetch_all_jobs_recruited_by_client();
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetch_all_jobs_recruited_by_client();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4 text-center mt-2">Pending Hiring Applications:</h2>
      <div className="table-responsive shadow-lg p-3 mb-5 bg-body rounded text-center">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>S.NO</th>
              <th>Worker Name</th>
              <th>Job Name</th>
              <th>Slot Date & Time</th>
              <th>Status</th>
              <th>Cancel Application?</th>
            </tr>
          </thead>
          <tbody>
            {formData.length > 0 ? (
              formData
                .filter(
                  (form) =>
                    form.jobAcceptedByWorker === false ||
                    form.jobRejectedByWorker === true
                )
                .map((form, index) => (
                  <tr
                    key={form._id || index}
                    style={{
                      textDecoration:
                        form.workerId?.isActive === false ? "line-through" : "none",
                      opacity: form.workerId?.isActive === false ? 0.6 : 1,
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{form.workerId?.fullName || "Unknown"}</td>
                    <td>{form.jobId?.job}</td>
                    <td>
                      {new Date(form.slotDate).toLocaleDateString()} , {form.slotTime}
                    </td>
                    <td>
                      {form.jobRejectedByWorker === true ? (
                        <label className="fs-5 fw-medium" style={{ color: "red" }}>
                          Rejected
                        </label>
                      ) : (
                        <label className="fs-5 fw-medium" style={{ color: "blue" }}>
                          Pending
                        </label>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => delete_pending_app(form._id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No pending applications
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
}

export default Pending_requests;
