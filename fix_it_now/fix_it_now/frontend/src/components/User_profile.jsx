import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const renderNumericRating = (rating) => {
  if (rating > 0) {
    return (
      <span className="ms-1 text-success fw-bold">{rating.toFixed(1)} / 5</span>
    );
  }
  return <span className="ms-1 text-muted">N/A</span>;
};

function User_profile() {
  const location = useLocation();
  const userId = location.state?.userId;
  const show_review = location.state?.show_review;
  const token = localStorage.getItem("token");

  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔴 Deactivate Account
  const deactivate_account = async (userId) => {
    try {
      await axios.get(
        `http://localhost:3000/api/admin/deactivateAccount/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Account Deactivated");
      getUserProfile();
    } catch (err) {
      console.log(err.message);
    }
  };

  // 🟢 Activate Account
  const activate_account = async (userId) => {
    try {
      await axios.get(
        `http://localhost:3000/api/admin/activateAccount/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Account Activated");
      getUserProfile();
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/admin/view_user_profile/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data.userdata);
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getUserProfile();
  }, [userId]);

  const isClient = userData?.role?.toLowerCase() === "client";
  const bookingsTitle = show_review
    ? `Reviews for ${userData?.fullName}`
    : isClient
    ? "Jobs Hired by Client"
    : "Jobs Accepted by Worker";

  const renderBookingEntry = (booking, index, showReviewMode) => {
    const clientData = booking.clientId;
    if (
      !(
        booking.jobAcceptedByWorker === true &&
        booking.jobRejectedByWorker === false
      )
    )
      return null;

    if (showReviewMode) {
      if (!booking.review || booking.review.trim() === "") return null;
      const jobRating = booking.rating || 0;
      return (
        <tr key={booking._id || index}>
          <td className="align-middle text-break">{booking.jobId?.job}</td>
          <td className="align-middle">{clientData?.fullName || "N/A"}</td>
          <td className="align-middle">{renderNumericRating(jobRating)}</td>
          <td className="align-middle text-muted small review-cell">
            {booking.review.substring(0, 80)}...
          </td>
        </tr>
      );
    }

    const otherParty = isClient ? booking.workerId : booking.clientId;
    const partyLabel = isClient ? "Hired Worker" : "Recruited BY";
    const partyRole = isClient ? "Worker" : "Client";
    const partyIdLabel = isClient ? "Worker id" : "Client id";

    return (
      <div className="col-md-4 mb-4" key={booking._id || index}>
        <div className="card shadow-lg h-100">
          <div className="card-body">
            <h5 className="card-title">
              {booking.jobId?.jobTitle || booking.job}
            </h5>
            <p>
              <strong>Status:</strong> Accepted
            </p>
            <p className="mb-1 fs-5">
              <strong>Job:</strong> {booking.jobId?.job}
            </p>
            <hr />
            {otherParty ? (
              <>
                <label className="form-label fw-bold">{partyLabel}:</label>
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={
                      otherParty.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={partyRole}
                    className="rounded-circle me-2"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p className="mb-0">
                      <strong>{partyRole}:</strong> {otherParty.fullName}
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong> {otherParty.email}
                    </p>
                    <p className="mb-0">
                      <strong>{partyIdLabel}:</strong> {otherParty._id}
                    </p>
                  </div>
                </div>
                <p className="mb-0">
                  <strong>Job id:</strong>
                  <Link to="/booking_form" state={{ jobId: booking.jobId?._id }}>
                    {" "}
                    {booking.jobId?._id}
                  </Link>
                </p>
                <p className="mb-0">
                  <strong>booking id:</strong>
                  <Link to="/booking_form" state={{ jobId: booking._id }}>
                    {" "}
                    {booking._id}
                  </Link>
                </p>
              </>
            ) : (
              <p>No {partyRole.toLowerCase()} assigned/found for this job.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      {loading ? (
        <h3 className="text-center mt-4">Loading user profile...</h3>
      ) : error ? (
        <h3 className="text-center mt-4 text-danger">{error}</h3>
      ) : !userData ? (
        <h3 className="text-center mt-4 text-danger">No user data found</h3>
      ) : (
        <>
          <div className="card shadow-lg border-0 p-4 mb-5">
            <div className="row g-3">
              <div className="col-md-3 text-center">
                <img
                  src={
                    userData.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="User"
                  className="rounded-circle mb-2 shadow"
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  {userData?.isActive ? (
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => deactivate_account(userData._id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm mt-2"
                      onClick={() => activate_account(userData._id)}
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
              <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="mb-1">{userData.fullName}</h4>
                    <p className="mb-1 text-muted">ID: {userData._id}</p>
                    <p className="mb-0 text-muted">{userData.role}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Email:</strong> {userData.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {userData.mobileNum}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Address:</strong></p>
                    <p className="mb-0 small text-muted">{userData.Street}, {userData.mandal}, {userData.district}</p>
                    <p className="mb-0 small text-muted">{userData.state}, {userData.country} - {userData.pinCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-4">{bookingsTitle}</h3>
          {show_review ? (
            <div className="table-responsive">
              <table className="table table-hover table-bordered shadow-sm">
                <thead className="table-info text-white">
                  <tr>
                    <th style={{ width: "15%" }}>Job Name</th>
                    <th style={{ width: "15%" }}>Client Name</th>
                    <th style={{ width: "10%" }}>Rating</th>
                    <th style={{ width: "60%" }}>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking, index) =>
                      renderBookingEntry(booking, index, show_review)
                    )
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No reviews available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="row">
              {bookings.length > 0 ? (
                bookings.map((booking, index) =>
                  renderBookingEntry(booking, index, show_review)
                )
              ) : (
                <h5 className="text-center">
                  {isClient
                    ? "No jobs have been hired yet"
                    : "No jobs accepted yet"}
                </h5>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default User_profile;
