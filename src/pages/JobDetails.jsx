import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Navbar for admin
const adminNavbar = [
    { title: "Dashboard", url: "admin-dashboard" },
    { title: "Manage Jobs", url: "job" },
    { title: "Manage Scholarships", url: "scholarship" },
    { title: "Users", url: "users" },
];

// Navbar for user
const userNavbar = [
  { title: "Dashboard", url: "user-dashboard" },
  { title: "Jobs", url: "userJobs" },
  { title: "Scholarships", url: "userScholarships" },
  { title: "Profile", url: "profile" },
];

export default function JobDetails() {
    const location = useLocation();
    const isAdmin = location.state?.isAdmin;
    const {id} = location.state
    const [job, setJob]= useState();
    const [jobs, setJobs] = useState([]);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    
    // Fetch all jobs
    const handleFetch = async () => {
        const response = await axios.get("https://edoponline.netlify.app/api/job/fetch");
        setJobs(response.data);
    };

    useEffect(() => {
        handleFetch()
    }, [reload]);

    // Find job by ID and set it to state
    const findJobById = async(id) => {
        for(let job of jobs) {
            if (job._id == id) {
                setJob(job);
            }
        }
    };

    useEffect(() => {
        findJobById(id)
    }, [id, jobs]);

    // Determine which navbar to use based on the URL
    const getNavbar = () => {
      return isAdmin ? adminNavbar : userNavbar;
    };

    return (
        <div>
            <div className="bg-dark text-white">
                <div
                    id="navbar"
                    style={{
                        display: "flex",
                        paddingBlock: ".5em",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
                            <Link to="/user-dashboard" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
                        </h2>
                        <ul
                            className="list-unstyled"
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                listStyle: "none",
                                margin: 0,
                            }}
                        >
                            {getNavbar()?.map((item) => (
                                <li key={item.url} style={{ marginInline: "1em" }}>
                                    <Link to={`/${item?.url}`} style={{ color: "white", textDecoration: "none" }}>
                                        {item?.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link to='/'>
                        <button type='button' className='btn btn-danger' id='sidebarCollapse'>
                        Logout
                        </button>
                    </Link>
                </div>
            </div>
            <div id="jobDetails" className='container ml-5 p-3'>
                <div>
                    {/* Render job details here */}
                    {job && (
                        <>
                        <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Job Details</h3>
                        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Title:</strong> {job.title}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Job Type:</strong> {job.type}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Description:</strong> {job.description}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Employer:</strong> {job.employer}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Pay Type:</strong> {job.payType}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Salary:</strong> {job.salary}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Hourly Pay:</strong> {job.hourlyPay}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Schedule:</strong> {job.schedule}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Weekly Hours:</strong> {job.weeklyHours}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Required Qualifications:</strong> {job.reqQual}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Preferred Qualifications:</strong> {job.prefQual}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Location:</strong> {job.location}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Remote:</strong> {job.remote}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Benefits:</strong> {job.benefits}
                            </div>
                        </div>
                        </>
                    )}
                </div>

                {/*This will route to an application page*/}
                {job && (
                    <Link to="/jobApply" state={job}>
                        <button className="btn btn-primary" style={{ marginTop: '10px' }}>Apply</button>
                    </Link>
                )}
                <button onClick={goBack} className="btn btn-secondary" style = {{marginTop: '10px', marginLeft: '5px'}}>
                    Back
                </button>
            </div>
        </div>
    );
}
