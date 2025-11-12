import express from "express";
import { protectRoute } from "../middlewear/protectRoute.js";
import { accept_application, accepted_applications, activateAccount, client_info, deactivateAccount, display_pending_jobs, get_booking_form, reject_application, rejected_applications, search_job_accepted, search_job_pending, search_job_rejected, view_user_profile, worker_info } from "../controller/admin.controller.js";

const Router=express.Router();

Router.get('/display_pending_jobs',protectRoute,display_pending_jobs);

Router.post('/accept_application',protectRoute,accept_application);

Router.post('/reject_application',protectRoute,reject_application);

Router.get('/accepted_applications',protectRoute,accepted_applications);

Router.get('/rejected_applications',protectRoute,rejected_applications);

Router.get('/search_job_accepted',protectRoute,search_job_accepted);

Router.get('/search_job_rejected',protectRoute,search_job_rejected);

Router.get('/search_job_pending',protectRoute,search_job_pending);

Router.get('/worker_info',protectRoute,worker_info);

Router.get('/view_user_profile/:userId',protectRoute,view_user_profile);

Router.get('/client_info',protectRoute,client_info);

Router.get('/get_booking_form/:jobId',protectRoute,get_booking_form);

Router.get('/deactivateAccount/:userId',protectRoute,deactivateAccount);

Router.get('/activateAccount/:userId',protectRoute,activateAccount);

export default Router;