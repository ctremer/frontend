import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as ReactRoutes,
} from "react-router-dom";

import Home from "./components/home";
import Login from "./components/login";
import About from "./components/about";
import Signup from "./components/signup";
import Academics from "./components/academics";
import AdminDashboard from "./components/adminDashboard";
import UserDashboard from "./components/userDashboard";
import Profile from "./components/profile";
import Scholarship from "./pages/Scholarship";
import ScholarshipDetails from "./pages/ScholarshipDetails.jsx"
import Jobs from "./pages/Job";
import JobDetails from "./pages/JobDetails.jsx";
import Users from "./pages/Users";
import UserJobs from "./components/UserDashbaord/jobs.jsx";
import UserScholarship from "./components/UserDashbaord/scholarships.jsx";
import UserDashboardHome from "./components/UserDashbaord/dashboard.jsx";
import PersonalInfo from "./components/registrationform.jsx";
import AcademicExperience from "./components/academics.jsx";
import EmploymentHistory from "./components/employment.jsx";
import CreateAdmin from "./components/createAdmin.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import ScholarshipEssay from "./components/scholarshipEssay.jsx";
import JobApply from "./pages/jobApply.jsx";
import ScholarshipApply from "./pages/scholarshipApply.jsx";

const Routes = () => {
  return (
    <Router>
      <ReactRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/scholarship" element={<Scholarship />} />
        <Route path="/scholarship-details" element={<ScholarshipDetails />} />
        <Route path="/job" element={<Jobs />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/personal-info" element={<PersonalInfo />} />
        <Route path="profile/academics-experience" element={<AcademicExperience />} />
        <Route path="profile/employment-history" element={<EmploymentHistory />} />
        <Route path = "/userJobs" element={<UserJobs />} />
        <Route path = "/userScholarships" element = {<UserScholarship />} />
        <Route path = "/user-dashboard-home" element = {<UserDashboardHome />} />
        <Route path = "/create-admin" element = {<CreateAdmin/>} />
        <Route path = "/reset-password" element = {<ResetPassword />} />
        <Route path = "/scholarship/essay" element = {<ScholarshipEssay/>} />
        <Route path = "/jobApply" element = {<JobApply/>} />
        <Route path = "/scholarshipApply" element = {<ScholarshipApply/>} />
      </ReactRoutes>
    </Router>
  );
};

export default Routes;