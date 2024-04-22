import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

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

    const {id} = location.state
    const isAdmin = location.state?.isAdmin;
    const [schol, setSchol]= useState();
    const [schols, setSchols] = useState([]);
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
        const response = await axios.get("https://nami-backend.onrender.com/api/scholarship/fetch");
        setSchols(response.data);
    };

    useEffect(() => {
        handleFetch()
    }, [reload]);

    // Find job by ID and set it to state
    const findScholById = async(id) => {
        for(let schol of schols) {
            if (schol._id == id) {
                setSchol(schol);
            }
        }
    };

    useEffect(() => {
        findScholById(id)
    }, [id, schols]);

    const getNavbar = () => {
        return isAdmin ? adminNavbar : userNavbar;
      };

    const formatDate = (date) => {
    const parts = date.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
    const day = parseInt(parts[2]);

    // Create a new Date object using the parsed values
    const newDate = new Date(year, month, day);

    // Format the date as "yyyy-MM-dd"
    const formattedDate = newDate.toISOString().split('T')[0];
    return formattedDate;
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
            <div id="scholarshipDetails" className='container ml-5 p-3'>
                <div>
                    {/* Render job details here */}
                    {schol && (
                        <>
                            <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Scholarship Details</h3>
                            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Title:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{schol.title}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Open Date:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{formatDate(schol.openDate)}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Deadline:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{formatDate(schol.deadline)}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Description:</h1> 
                                <ReactMarkdown>{schol.description}</ReactMarkdown>
                            </div>                           
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Amount per Award:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{schol.amtPerAward}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Awards Available:</h1> <span style={{ fontSize: '24px', color: '#725696'  }}>{schol.awardsAvail}</span>
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <h1>Qualifications:</h1> 
                                <ReactMarkdown>{schol.qualifications}</ReactMarkdown>
                            </div>
                        </div>
                            
                        </>
                    )}
                </div>
                {!isAdmin && schol && (
                    <>
                        <Link to={"/scholarship/essay"} state={schol} className="btn btn-primary" style={{ marginRight: '5px', marginTop: '10px' }}>Submit Essay</Link>
                        {/* This will route to an application page */}
                        <Link to="/scholarshipApply">
                        <button className="btn btn-primary" style={{ marginRight: '5px', marginTop: '10px' }}>Apply</button>
                        </Link>
                    </>
                    )}
                <button onClick={goBack} className="btn btn-secondary" style = {{marginTop: '10px'}}>
                    Back
                </button>
            </div>
        </div>
    );
}
