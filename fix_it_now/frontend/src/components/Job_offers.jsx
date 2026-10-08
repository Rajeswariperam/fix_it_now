import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Job_offers() {
  const token = localStorage.getItem("token");
  const [jobOffers, setJobOffers] = useState([]);
  const get_job_offers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/booking/get_job_offer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobOffers(res.data.jobOffers);
    } catch (err) {
      console.log(err.message);
    }
  };
  const accept_job = async (bookingId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/booking/accept_job/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      get_job_offers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  const reject_job = async (bookingId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/booking/reject_job/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.error("application rejected");
      get_job_offers();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    get_job_offers();
  }, []);
  const pendingOffers = jobOffers.filter(
    (offer) => offer.jobRejectedByWorker === false && offer.jobAcceptedByWorker === false
  );

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Pending Job Offers</h3>

      {pendingOffers.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {pendingOffers.map((offer) => (
            <div key={offer._id} className="card shadow-lg border-0 p-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <img
                    src={offer.clientId?.profilePic || "/vite.svg"}
                    alt="profile"
                    className="rounded-circle me-3"
                    width="45"
                    height="45"
                  />
                  <div>
                    <small className="text-muted d-block">Client</small>
                    <strong>{offer.clientId?.fullName || "Loading..."}</strong>
                  </div>
                </div>
                <div className="mb-2 mb-md-0 ms-md-4">
                  <small className="text-muted d-block">Job</small>
                  <strong>{offer.jobId?.job || "Loading..."}</strong>
                </div>
                <div className="text-center mb-2 mb-md-0 ms-md-4">
                  <small className="text-muted d-block">Client Address:</small>
                  <strong>
                    {offer.clientId?.Street}, {offer.clientId?.mandal}, {offer.clientId?.district}
                  </strong>
                  <br />
                  <strong>
                    {offer.clientId?.state}, {offer.clientId?.country}, {offer.clientId?.pinCode}
                  </strong>
                </div>
                <div className="text-center mb-2 mb-md-0 ms-md-4">
                  <small className="text-muted d-block">Slot Date & Time</small>
                  <strong>{new Date(offer.slotDate).toLocaleDateString()} , </strong>
                  <strong>{offer.slotTime}</strong>
                </div>
                <div className="ms-md-4">
                  <small className="text-muted d-block">Status</small>
                  <div className="mt-1">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => accept_job(offer._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => reject_job(offer._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">No job offers found</div>
      )}

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default Job_offers;
