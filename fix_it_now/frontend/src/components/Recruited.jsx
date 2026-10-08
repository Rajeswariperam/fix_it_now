import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Recruited() {
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

  useEffect(() => {
    fetch_all_jobs_recruited_by_client();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4 text-center mt-2">Recruited Workers:</h2>
      <div className="table-responsive shadow-lg p-3 mb-5 bg-body rounded text-center">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>S.NO</th>
              <th>Worker Name</th>
              <th>Job Name</th>
              <th>Slot Date & Time</th>
              <th>Status</th>
              <th>Add Reviews</th>
              <th>Cancel Booking?</th>
            </tr>
          </thead>
          <tbody>
            {formData.length > 0 ? (
              formData
                .filter(
                  (form) =>
                    form.jobAcceptedByWorker === true &&
                    form.jobRejectedByWorker === false
                )
                .map((form, index) => (
                  <tr
                    key={form._id || index}
                    style={{
                      textDecoration: form.workerId?.isActive === false ? "line-through" : "none",
                      opacity: form.workerId?.isActive === false ? 0.6 : 1,
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{form.workerId?.fullName || "Unknown"}</td>
                    <td>{form.jobId?.job}</td>
                    <td>
                      {new Date(form.slotDate).toLocaleDateString()} ,{" "}
                      {form.slotTime}
                    </td>
                    <td
                      style={{
                        color:
                          form.workerId?.isActive === false ? "gray" : "green",
                      }}
                      className="fs-5 fw-medium"
                    >
                      {form.workerId?.isActive === false
                        ? "Deactivated"
                        : "Accepted"}
                    </td>
                    <td>
                      <Link
                        to="/write_review"
                        state={{ bookingId: form._id }}
                        className="btn btn-success"
                      >
                        +
                      </Link>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm mt-1">
                        Contact Admin
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Not recruited anyone
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Recruited;
