import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast ,ToastContainer} from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const token=localStorage.getItem('token');
  const login_email = localStorage.getItem("user_email");
  const login_role = localStorage.getItem("role");
  const login_name = localStorage.getItem("user_name");
  const [all_reviews,set_all_reviews]=useState([]);
  const [AvgSum,setAvgSum]=useState(0);
  const [totalReviews,setTotalReviews]=useState(0);

  const get_reviews_overview=async(e)=>{
  try {
    const res = await axios.get('http://localhost:3000/api/reviews/get_review_overview', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const reviews = res.data.all_reviews || []; 
    set_all_reviews(reviews);
    const sum = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    const avg = reviews.length > 0 ? sum / reviews.length : 0;
    setTotalReviews(reviews.length);
    setAvgSum(avg.toFixed(1)); 
  } catch (err) {
    console.log(err.message);
  }
}

  const delete_review=async(bookingId)=>{
    try{
      const res= await axios.put(`http://localhost:3000/api/reviews/deleteReview/${bookingId}`,{},{
        headers:{Authorization:`Bearer ${token}`}
      });
      toast.success(res.data.message);
      get_reviews_overview();
    }catch(err){
      console.log(err.message);
    }
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNum: "",
    Street: "",
    mandal: "",
    district: "",
    state: "",
    country: "",
    pinCode: "",
    profilePic: "", 
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:3000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          fullName: res.data.fullName || "",
          mobileNum: res.data.mobileNum || "",
          Street: res.data.Street || "",
          mandal: res.data.mandal || "",
          district: res.data.district || "",
          state: res.data.state || "",
          country: res.data.country || "",
          pinCode: res.data.pinCode || "",
          profilePic: res.data.profilePic || "", 
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    if(login_role==='worker' || login_role==='client'){
      get_reviews_overview();
    }
    fetchProfile();
  }, []);

  const logout_user = async () => {
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <div className="container mt-3">
      <div className="row">
        <div className="col-10">
          <center className="fw-medium fs-3 ms-5 ps-5">Profile DashBoard</center>
        </div>
        <div className="col-2 text-end">
          <div className="fw-medium fs-3">
            <button className="btn btn-danger" onClick={logout_user}>
              logout
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <div className="shadow-lg p-3 position-fixed" style={{ borderRadius: "20px" }}>
            <div className="text-center mb-3">
              <img
                src={formData.profilePic || "vite.svg"}
                alt="Profile"
                width="150"
                height="150"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div>
              <p><strong>User Name:</strong> {login_name}</p>
              <p><strong>Email:</strong> {login_email}</p>
              <p><strong>Mobile no:</strong> {formData.mobileNum}</p>
              <p><strong>Role:</strong> {login_role}</p>
              <p>
                <strong>Address:</strong>{" "}
                {`${formData.Street}, ${formData.mandal}, ${formData.district}, ${formData.state}, ${formData.country} - ${formData.pinCode}`}
              </p>
              <center>
                <Link to="/update_profile" className="btn btn-success mt-2">
                  Edit Profile
                </Link>
              </center>
            </div>
          </div>
        </div>
        {login_role === "worker" ? (
          <div className="col-md-8">
            <h3 className="fw-medium mb-3">Client Reviews</h3>
            <h4 className="d-flex justify-content-end mb-2 pb-3">Average Rating:{AvgSum}</h4>
            {all_reviews.length > 0 ? (
              all_reviews.map((review) => (
                <div
                  key={review._id}
                  className="shadow p-3 mb-3"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="d-flex justify-content-between fs-5">
                    <strong>Client:</strong> {review.clientId?.fullName || "Anonymous"}
                    <strong>Job:</strong> {review.jobId?.job || "N/A"}
                  </div>
                  <div className="mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= review.rating ? "gold" : "gray",
                          fontSize: "20px",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="mt-2">{review.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        ):login_role==="client"?(
          <>
            <div className="col-md-8">
            <h3 className="fw-medium mb-3">Your Reviews</h3>
            <h4 className="d-flex justify-content-end pb-3">Total Reviews : {totalReviews}</h4>
            {all_reviews.length > 0 ? (
              all_reviews.map((review) => (
                <div
                  key={review._id}
                  className="shadow p-3 mb-3"
                  style={{ borderRadius: "15px" }}
                >
                  <div className="d-flex justify-content-between fs-5">
                    <strong>worker:</strong> {review.workerId?.fullName || "Anonymous"}
                    <strong>Job:</strong> {review.jobId?.job || "N/A"}
                  </div>
                  <div className="mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= review.rating ? "gold" : "gray",
                          fontSize: "20px",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="row">
                    <div className="col-10">
                        <p className="mt-2">{review.review}</p>
                      </div>
                     <div className="col-2">
                      <button className="btn btn-danger btn-sm" onClick={()=>delete_review(review._id)}>Delete Review</button>
                     </div>
                  </div>
                </div>
              ))
            ) : (
              <p>no reviews yet.</p>
            )}
          </div>
          </>
        ):(
          <>
            <h1>admin section</h1>
          </>
        )}
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={1000}/>
    </>
  );
}

export default Profile;
