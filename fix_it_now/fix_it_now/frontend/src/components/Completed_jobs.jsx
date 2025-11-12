import axios from "axios";
import { useEffect, useState } from "react";

function Completed_jobs() {
  const token = localStorage.getItem("token");
  const [jobOffers, setJobOffers] = useState([]);
  const get_completed_jobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/booking/get_completed_jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setJobOffers(res.data.jobOffers);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    get_completed_jobs();
  }, []);


  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Completed Job Offers</h3>

      {jobOffers.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {jobOffers.map((offer) => (
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
                    <strong className="fs-5 fw-bold " style={{color:"green"}}>Completed</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">No job offers found</div>
      )}
    </div>
  );
}

export default Completed_jobs;
