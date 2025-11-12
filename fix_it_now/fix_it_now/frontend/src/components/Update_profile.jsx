import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Update_Profile() {
  const navigate = useNavigate();
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
  });
  const [loading, setLoading] = useState(true);
  const [profilePicFile, setProfilePicFile] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data;
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          mobileNum: data.mobileNum || "",
          Street: data.Street || "",
          mandal: data.mandal || "",
          district: data.district || "",
          state: data.state || "",
          country: data.country || "",
          pinCode: data.pinCode || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update personal details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:3000/api/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Update profile picture
  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    if (!profilePicFile) {
      alert("Please select an image first");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formDataPic = new FormData();
      formDataPic.append("profilePic", profilePicFile);

      await axios.put("http://localhost:3000/api/user/update", formDataPic, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="container mt-5 pt-3 pb-5 mb-5 shadow-lg"
      style={{ borderRadius: "20px" }}
    >
      <center>
        <label className="form-label fs-2 fw-medium">Update Profile</label>
      </center>
      <hr />

      {/* Profile Picture Section */}
      <div className="mb-3">
        <label className="form-label fs-4 fw-medium">
          Change profile picture?
        </label>
        <input
          type="file"
          className="ms-4"
          accept="image/*"
          onChange={(e) => setProfilePicFile(e.target.files[0])}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={handleProfilePicUpload}
        >
          Upload Profile Picture
        </button>
      </div>

      <hr />
      <label className="form-label fw-medium fs-4">Personal Details</label>
      <hr />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="mobileNum"
          value={formData.mobileNum}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="form-control mb-2"
        />

        <label className="form-label fs-4 fw-medium">Address:</label>
        <hr />
        <input
          type="text"
          name="Street"
          value={formData.Street}
          onChange={handleChange}
          placeholder="Street"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="mandal"
          value={formData.mandal}
          onChange={handleChange}
          placeholder="Mandal"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="District"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
          placeholder="Pin Code"
          className="form-control mb-2"
        />

        <center>
          <button type="submit" className="btn btn-success mb-1 mt-3">
            Save Changes
          </button>
        </center>
      </form>
    </div>
  );
}

export default Update_Profile;
