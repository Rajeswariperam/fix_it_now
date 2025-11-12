import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

function Booking_form() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const jobId = location.state?.jobId;
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const get_booking_form = async () => {
    if (!jobId) {
      setError("No Job ID provided to fetch booking data.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:3000/api/admin/get_booking_form/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.bookingdata;
      
      if (Array.isArray(data)) {
          setBookings(data);
      } else if (data) {
          setBookings([data]);
      } else {
          setError("No booking data found.");
      }
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_booking_form();
  }, [jobId]); 

  if (loading) return <div className="text-center mt-5">Loading booking details...</div>;
  if (error) return <div className="alert alert-danger mx-auto mt-5" style={{maxWidth: '600px'}}>Error: {error}</div>;
  if (bookings.length === 0) return <div className="text-center mt-5">No accepted bookings found for this job ID.</div>;

  const renderBookingDetails = (booking, index) => {
    const jobName = booking.jobId?.job || "N/A";
    const clientName = booking.clientId?.fullName || "N/A";
    const workerName = booking.workerId?.fullName || "N/A";
    const slotDate = formatDate(booking.slotDate);
    const slotTime = booking.slotTime || "N/A";

    return (
      <div className="card shadow-sm mb-4" key={booking._id || index}>
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Booking Details #{index + 1}</h5>
        </div>
        <div className="card-body">
          <form>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Job Name:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{jobName}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Client Name:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{clientName}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">client email:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{booking.workerId?.email}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">client Address:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{booking.clientId?.Street},{booking.clientId?.mandal},{booking.clientId?.district},{booking.clientId?.state},{booking.clientId?.countrty},{booking.clientId?.pinCode}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Worker Name:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{workerName}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Worker email:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{booking.clientId.email}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Worker Address:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{booking.workerId?.Street},{booking.workerId?.mandal},{booking.workerId?.district},{booking.workerId?.state},{booking.workerId?.countrty},{booking.workerId?.pinCode}</p>
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Date:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{slotDate}</p>
              </div>
            </div>

            <div className="mb-3 row">
              <label className="col-sm-4 col-form-label fw-bold">Time Slot:</label>
              <div className="col-sm-8">
                <p className="form-control-plaintext">{slotTime}</p>
              </div>
            </div>
            <div className="text-muted border-top pt-2 mt-3">
              <small>Booking ID: {booking._id}</small>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Booking Information</h2>
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {bookings.map(renderBookingDetails)}
        </div>
      </div>
    </div>
  );
}

export default Booking_form;