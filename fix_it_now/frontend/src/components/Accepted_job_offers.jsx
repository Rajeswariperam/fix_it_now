import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function Accept_job_offers() {
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

  useEffect(() => {
    get_job_offers();
  }, []);

  const pendingOffers = jobOffers.filter(
    (offer) => offer.jobRejectedByWorker === false && offer.jobAcceptedByWorker === true
  );

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Accepted Job Offers</h3>

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
                    <strong className="fs-5 fw-bold " style={{color:"green"}}>ACCEPTED</strong>
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

export default Accept_job_offers;
