import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

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

    const auth = localStorage.getItem('auth');

    useEffect(() => {
        if (!auth) {
        return navigate('/login');
        }
    });

    const goBack = () => {
        navigate(-1);
    };
    
    // Fetch all jobs
    const handleFetch = async () => {
        const response = await axios.get("https://nami-backend.onrender.com/api/job/fetch");
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

    const handleLogout = () => {
        localStorage.removeItem('auth');
      }

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
                        <button type='button' className='btn btn-danger' id='sidebarCollapse' onClick={handleLogout}>
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
                                <h1 style={{color:"black", }}>Title:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.title}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Job Type:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.type}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                            <h1 style={{color:"black", }}>Description:</h1>
                            <ReactMarkdown >{job.description}</ReactMarkdown>
                                
                            </div>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Employer:</h1> <span style={{fontSize: '24px', color: '#725696'  }}>{job.employer}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Pay Type:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.payType}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Salary:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.salary}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Schedule:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.schedule}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Weekly Hours:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{job.weeklyHours}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Required Qualifications:</h1>
                                <ReactMarkdown >{job.reqQual}</ReactMarkdown>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Preferred Qualifications:</h1>
                                <ReactMarkdown >{job.prefQual}</ReactMarkdown>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Location:</h1> <span style={{ fontSize: '24px', color: '#725696' }}>{job.location}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Remote:</h1> <span style={{ fontSize: '24px', color: '#725696' }}>{job.remote}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1 style={{color:"black", }}>Benefits:</h1>
                                <ReactMarkdown >{job.benefits}</ReactMarkdown>
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
