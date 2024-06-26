import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import uxImage from './jobs_images/ux.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const navbar = [
  { title: "Dashboard", url: "user-dashboard" },
  { title: "Jobs", url: "userJobs" },
  { title: "Scholarships", url: "userScholarships" },
  { title: "Profile", url: "profile" },
];

const UserDashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllScholarships, setShowAllScholarships] = useState(false);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [displayedScholarships, setDisplayedScholarships] = useState([]);
  const navigate = useNavigate();

  const auth = localStorage.getItem('auth');

    useEffect(() => {
      if (!auth) {
        return navigate('/login');
      }
    });
    

  // Fetch scholarships from the database
  useEffect(() => {
    fetchScholarships();
    fetchJobs();
  }, []);

  // Fetch scholarships data from the API
  const fetchScholarships = async () => {
    const response = await axios("https://nami-backend.onrender.com/api/scholarship/fetch");
    setScholarships(response?.data);
    setDisplayedScholarships(response?.data.slice(0, 3));
  };

  const fetchJobs = async () => {
    const response = await axios.get("https://nami-backend.onrender.com/api/job/fetch");
    setJobs(response.data);
    setDisplayedJobs(response.data.slice(0, 3));
  };

  // Render scholarship cards
  const renderScholarshipCards = () => {
    const scholarshipsToDisplay = showAllScholarships ? scholarships : displayedScholarships;
    return scholarshipsToDisplay.map((scholarship, index) => (
      <div key={index} className='col-md-4 mt-4'>
        <Link to='/scholarship-details' state={{id: scholarship._id, isAdmin: false}} className="btn btn-success mr-2" style={{ borderColor: 'transparent',textDecoration: 'none', backgroundColor: 'transparent'}}>
          <div className='card' style={{ width: '23rem', height:'350px' }}>
            {/* <h5 className='card-img-top' style={{ height: '200px', fontSize: 'clamp(1.5rem, 4vw, 3rem)', backgroundImage: 'linear-gradient(to bottom, #222725, #ACAEAD)', color: 'white', alignContent: 'center' }}>{scholarship.title} </h5> */}
            <img className='card-img-top' src={scholarship.photo} alt={scholarship.title + " Image"} style={{ height: '200px', objectFit: 'cover' }} />
            <div className='card-body' style={{maxHeight: '150px', overflow: 'hidden' }}>
            <h5 className='card-title'> Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US')}</h5>
              <ReactMarkdown>{scholarship.title}</ReactMarkdown>
            </div>
          </div>
        </Link>
        
      </div>
    ));
  };

  // Render job cards
  const renderJobCards = () => {
    const jobsToDisplay = showAllJobs ? jobs : displayedJobs;
    return jobsToDisplay.map((job, index) => (
      <div className='col-md-4' key={index}>
        <Link to='/job-details' state={{id: job._id}} className="btn btn-success mr-2" style={{ borderColor: 'transparent',textDecoration: 'none', backgroundColor: 'transparent'}}>
          <div className='card' style={{ width: '23rem', cursor: 'pointer', height:'350px' }}>
            {/* <h5 className='card-img-top' style={{ alignContent: 'center', height: '200px', fontSize: 'clamp(1.5rem, 4vw, 3rem)', backgroundImage: 'linear-gradient(to bottom, #222725, #ACAEAD)', color: 'white' }}>{job.photo} </h5> */}
            <img className='card-img-top' src={job.photo} alt={job.title + " Image"} style={{ height: '200px', objectFit: 'cover' }} />
            <div className='card-body' style={{maxHeight: '150px', overflow: 'hidden' }}>
              <h5 className='card-title'>{job.employer}</h5>
              <ReactMarkdown>{job.title}</ReactMarkdown>
            </div>
          </div>
        </Link>
      </div>
    ));
  };

  // Toggle display of all jobs
  const toggleJobsDisplay = () => {
    setShowAllJobs(!showAllJobs);
    if (!showAllJobs) {
      setDisplayedJobs(jobs);
    } else {
      setDisplayedJobs(jobs.slice(0, 3));
    }
  };

  // Toggle display of all scholarships
  const toggleScholarshipsDisplay = () => {
    setShowAllScholarships(!showAllScholarships);
    if (!showAllScholarships) {
      setDisplayedScholarships(scholarships);
    } else {
      setDisplayedScholarships(scholarships.slice(0, 3));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
  }
  

  return (
    <div>
      <div className='bg-dark text-white'>
        <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
              <Link to='/user-dashboard' style={{ color: 'white', textDecoration: 'none' }}>
                ED OP
              </Link>
            </h2>
            <ul className='list-unstyled' style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', margin: 0 }}>
              {navbar?.map((item) => (
                <li key={item.url} style={{ marginInline: '1em' }}>
                  <Link to={`/${item.url}`} style={{ color: 'white', textDecoration: 'none' }}>
                    {item.title}
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

      {/* Jobs section */}
      <div id='jobs' className='container ml-5 p-3'>
        <h2>Jobs</h2>
        <div className='row mt-4 d-flex justify-content-center'>
          {/* Render job cards */}
          {renderJobCards()}
        </div>
        {/* See More button for jobs */}
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={toggleJobsDisplay}>
            {showAllJobs ? "See Less" : "See More"}
          </button>
        </div>
      </div>

      {/* Scholarships section */}
      <div id='scholarships' className='container ml-5 p-3'>
        <h2>Scholarships</h2>
        <div className='row mt-4 d-flex justify-content-center'>
          {/* Render scholarship cards */}
          {renderScholarshipCards()}
        </div>
        {/* See More button for scholarships */}
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={toggleScholarshipsDisplay}>
            {showAllScholarships ? "See Less" : "See More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;