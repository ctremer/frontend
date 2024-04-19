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

    const {id} = location.state
    const isAdmin = location.state?.isAdmin;
    const [schol, setSchol]= useState();
    const [schols, setSchols] = useState([]);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };
    
    // Fetch all jobs
    const handleFetch = async () => {
        const response = await axios.get("http://localhost:5000/api/scholarship/fetch");
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
            <div id="scholarshipDetails" className='container ml-5 p-3'>
                <div>
                    {/* Render job details here */}
                    {schol && (
                        <>
                            <h3 style={{ marginBottom: '10px', fontWeight: 'bold' }}>Scholarship Details</h3>
                            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                            
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Title:</strong> {schol.title}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Open Date:</strong> {formatDate(schol.openDate)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Deadline:</strong> {formatDate(schol.deadline)}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Description:</strong> {schol.description}
                            </div>                           
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Amount per Award:</strong> {schol.amtPerAward}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Awards Available:</strong> {schol.awardsAvail}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Qualifications:</strong> {schol.qualifications}
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
