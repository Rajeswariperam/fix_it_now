import { Link, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../utils/authUtils";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GlassCard, 
  ModernButton, 
  AnimatedSection, 
  LoadingSpinner,
  ModernInput,
  ModernGrid,
  
} from './ui/ModernUI';
// ServiceCategories removed from client main per user request (use backend-driven services)
// import ServiceCategories from './ServiceCategories';
import Navbar from './Navbar';
import "../styles/modern.css";

function Home() {
  const loggedIn = isLoggedIn();
  const token = localStorage.getItem("token");
  const user_role = localStorage.getItem("role");
  const location = useLocation();

  const [pendingRequests, setPendingRequests] = useState([]);
  const [appData, setAppData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState("");
  const [workerjob, setworkerjob] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [recruitedCount, setRecruitedCount] = useState(0);
  const [recruitedList, setRecruitedList] = useState([]);

  const showServicesFromLanding = location?.state?.showServices || false;

  const display_applyed_jobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/worker/display_accepted_jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.userData);
      setAppData(res.data.appData);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const delete_job_worker = async(appId)=>{
    try{
      const res=await axios.delete(`http://localhost:3000/api/worker/delete_job_worker/${appId}`,{
        headers:{Authorization:`Bearer ${token}`}
      })
      display_applyed_jobs();
      console.log(res.data.message);
    }catch(err){
      console.log(err.message);
    }
  }

  const display_all_workers = async () => {
    setIsLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get("http://localhost:3000/api/worker/get_all_workers", {
        headers,
      });
      setworkerjob(res.data.workerjob);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const search_for_jobs = async (query) => {
    if (!query) {
      display_all_workers();
      return;
    }
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`http://localhost:3000/api/worker/search_job/${query}`, {
        headers,
      });
      setworkerjob(res.data.workerjob);
    } catch (err) {
      setworkerjob([]);
    }
  };

  const display_pending_jobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/display_pending_jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingRequests(res.data.pendingRequests);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const Accept_job_application = async (requestId) => {
    try {
      toast.promise(
        axios.post('http://localhost:3000/api/admin/accept_application', 
          { requestId },
          { headers: { Authorization: `Bearer ${token}` }}
        ),
        {
          pending: 'Processing application...',
          success: 'Application approved successfully!',
          error: 'Failed to approve application'
        }
      );
      setTimeout(display_pending_jobs, 1500);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const reject_job_application = async (requestId) => {
    try {
      toast.promise(
        axios.post('http://localhost:3000/api/admin/reject_application', 
          { requestId },
          { headers: { Authorization: `Bearer ${token}` }}
        ),
        {
          pending: 'Processing rejection...',
          success: 'Application rejected successfully',
          error: 'Failed to reject application'
        }
      );
      setTimeout(display_pending_jobs, 1500);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const search_bar = async (query) => {
    if (!query) {
      display_pending_jobs();
      return;
    }
    try {
      const res = await axios.get("http://localhost:3000/api/admin/search_job_pending", {
        params: { searchQuery: query },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests(res.data.getAcceptedWorkers || []);
    } catch (err) {
      console.log("No search result found");
      setPendingRequests([]);
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      search_bar(searchQuery.toLowerCase());
    }, 200); 
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      search_for_jobs(search);
    }, 150);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCategorySelect = (category) => {
    setSearch(category.name.toLowerCase());
  };

  const fetchRecruitedCount = async () => {
    if (user_role !== 'client') return;
    try {
      const res = await axios.get('http://localhost:3000/api/booking/get_recruited_staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const items = res.data.formData || [];
      setRecruitedCount(items.length);
      setRecruitedList(items);
    } catch (err) {
      setRecruitedCount(0);
    }
  };

  const getServiceImage = (jobName, fallback) => {
    if (!jobName) return fallback || '/tools.avif';
    const key = jobName.toLowerCase();
    const map = {
      plumbing: '/services/plumbing.jpg',
      electrical: '/services/electrical.jpg',
      carpentry: '/services/carpentry.jpg',
      painting: '/services/painting.jpg',
      'ac repair': '/services/ac-repair.jpg',
      cleaning: '/services/cleaning.jpg',
      'home repair': '/services/home-repair.jpg',
      renovation: '/services/renovation.jpg'
    };
    return map[key] || fallback || '/tools.avif';
  };

  useEffect(() => {
    // If the landing page requested services (showServices) or a logged-in client,
    // fetch available services/workers. This lets the Explore button open Home and show services
    // even when the visitor isn't logged in.
    if (location?.state?.showServices) {
      display_all_workers();
      // do not fetch recruitedCount for guests
    } else if (user_role === "client") {
      display_all_workers();
      fetchRecruitedCount();
    } else if (user_role === "worker") display_applyed_jobs();
    else display_pending_jobs();
  }, []);

  return (
    <AnimatedSection>
      {/* Show Navbar for any logged-in user (was previously only shown for clients) */}
      {(!loggedIn && !showServicesFromLanding) ? (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center">
          <GlassCard>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center p-5"
            >
              <h1 className="mb-4 fw-bold">Welcome to Fix It Now</h1>
              <ModernButton onClick={() => window.location.href = '/login'}>
                Login to Continue
              </ModernButton>
            </motion.div>
          </GlassCard>
        </div>
      ) : isLoading ? (
        <LoadingSpinner />
  ) : user_role === "worker" ? (
        <div className="container py-5">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            Your Active Jobs
          </motion.h2>
          <GlassCard>
            <div className="table-responsive p-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {appData?.length > 0 ? (
                      appData
                        .filter(app => app.jobAccepted === true && app.jobRejected === false)
                        .map((app, index) => (
                          <motion.tr
                            key={app._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <td>{index + 1}</td>
                            <td>{userData?.fullName}</td>
                            <td>{app.job}</td>
                            <td>
                              <span className="badge bg-success">Active</span>
                            </td>
                            <td>
                              <ModernButton 
                                variant="danger"
                                onClick={() => delete_job_worker(app._id)}
                              >
                                Remove
                              </ModernButton>
                            </td>
                          </motion.tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No jobs available</td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      ) : user_role === "client" || showServicesFromLanding ? (
        <>
          {/* Navbar only in client dashboard main page (don't show for guest-driven Explore) */}
          {!showServicesFromLanding && <Navbar />}

          <div className="container py-3">
            <h3 className="mb-3">Services</h3>
            <div className="search-container text-center mb-4">
              <ModernInput
                type="text"
                placeholder="Search for services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <ModernGrid>
              <AnimatePresence>
                {workerjob.length > 0 ? (
                  workerjob
                    .filter((job) => job.userId.isActive === true)
                    .map((job, index) => (
                      <motion.div
                        key={job._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <GlassCard>
                          <motion.div 
                            className="card-image-container"
                            whileHover={{ scale: 1.02 }}
                          >
                            <img
                              src={getServiceImage(job.job, job.userId.profilePic || '/bg.webp')}
                              alt={job.job || job.userId.fullName}
                              className="card-img-top rounded"
                              style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                            />
                          </motion.div>
                          <div className="p-4">
                            <h4 className="mb-2">{job.userId.fullName}</h4>
                            <h5 className="text-primary mb-3">{job.job}</h5>
                            <p className="text-muted mb-3">{job.jobDescription}</p>
                            <p className="location mb-4">
                              <i className="fas fa-map-marker-alt me-2"></i>
                              {job.userId.district}
                            </p>
                            <div className="d-flex justify-content-between gap-3">
                              <ModernButton
                                onClick={() => {
                                  // If not logged in, send user to login with a redirect to the view page
                                  if (!loggedIn) {
                                    navigate('/login', { state: { redirectTo: '/view_worker_application', jobId: job._id } });
                                  } else {
                                    navigate('/view_worker_application', { state: { jobId: job._id } });
                                  }
                                }}
                              >
                                Hire Now
                              </ModernButton>
                              <ModernButton
                                variant="secondary"
                                onClick={() => navigate('/user_profile', { state: { userId: job.userId._id, show_review: false } })}
                              >
                                View Profile
                              </ModernButton>
                            </div>
                          </div>
                        </GlassCard>
                      </motion.div>
                    ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center w-100"
                  >
                    <h3>No services found</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModernGrid>
            {/* Recruited section - shows recent recruited jobs for client (skip for guest Explore) */}
            {!showServicesFromLanding && (
              <div className="mt-4">
                <h4>Your Recruited Jobs</h4>
                {recruitedList.length > 0 ? (
                  <div className="list-group mt-2">
                    {recruitedList.slice(0,5).map((r, i) => (
                      <div key={r._id || i} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{r.jobId?.job || r.job}</strong>
                          <div className="text-muted small">{r.workerId?.fullName || 'Unknown'}</div>
                        </div>
                        <div>
                          <small>{new Date(r.slotDate).toLocaleDateString()} {r.slotTime}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No recruited jobs yet. Book a slot to see it here.</p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container py-5">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            Pending Approvals
          </motion.h2>
          <div className="search-container text-center mb-4">
            <ModernInput
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <GlassCard>
            <div className="table-responsive p-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Job</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {pendingRequests?.length > 0 ? (
                      pendingRequests.map((request, index) => (
                        <motion.tr
                          key={request._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td>{index + 1}</td>
                          <td>
                            <Link to={`/user_profile?id=${request.userId._id}`}>
                              {request.userId.fullName}
                            </Link>
                          </td>
                          <td>{request.job}</td>
                          <td>
                            <span className="badge bg-warning">Pending</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <ModernButton
                                variant="success"
                                onClick={() => Accept_job_application(request._id)}
                              >
                                Accept
                              </ModernButton>
                              <ModernButton
                                variant="danger"
                                onClick={() => reject_job_application(request._id)}
                              >
                                Reject
                              </ModernButton>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No pending applications</td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={1500} theme="colored" />
    </AnimatedSection>
  );

}

export default Home;
