import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/Style/styles.css';
import projectImage from './jobs_images/project.png';
import ReactMarkdown from 'react-markdown';

const navbarItems = [
  { title: 'Dashboard', url: 'user-dashboard' },
  { title: 'Jobs', url: 'userJobs' },
  { title: 'Scholarships', url: 'userScholarships' },
  { title: 'Profile', url: 'profile' },
];

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJobTypeFilter, setSelectedJobTypeFilter] = useState('');
  const [selectedPayTypeFilter, setSelectedPayTypeFilter] = useState('');
  const [selectedRemoteFilter, setSelectedRemoteFilter] = useState('');

  const navigate = useNavigate();

  const auth = localStorage.getItem('auth');

  useEffect(() => {
    if (!auth) {
      return navigate('/login');
    }
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://nami-backend.onrender.com/api/job/fetch');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs(searchInput);
  }, [jobs, searchInput, selectedJobTypeFilter, selectedPayTypeFilter, selectedRemoteFilter]);

  const filterJobs = (input) => {
    const filtered = jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(input.toLowerCase());
      const descriptionMatch = job.description.toLowerCase().includes(input.toLowerCase());
      const payTypeMatch = !selectedPayTypeFilter || job.payType.toLowerCase() === selectedPayTypeFilter.toLowerCase();
      const qualMatch = job.reqQual.toLowerCase().includes(input.toLowerCase()) || job.prefQual.toLowerCase().includes(input.toLowerCase());
      const typeMatch = !selectedJobTypeFilter || job.type.toLowerCase() === selectedJobTypeFilter.toLowerCase();
      const remoteMatch = !selectedRemoteFilter || job.remote.toLowerCase() === selectedRemoteFilter.toLowerCase();
  
      return (!input || titleMatch || descriptionMatch || qualMatch) &&
             (!selectedPayTypeFilter || payTypeMatch) &&
             (!selectedJobTypeFilter || typeMatch) &&
             (!selectedRemoteFilter || remoteMatch);
    });
  
    setFilteredJobs(filtered);
  };
  
  
  
  

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleJobTypeFilterChange = (jobType) => {
    setSelectedJobTypeFilter(jobType); // Set the selected filter
  };

  const handlePayTypeFilterChange = (payType) => {
    setSelectedPayTypeFilter(payType); // Set the selected filter
  };

  const handleRemoteFilterChange = (remote) => {
    setSelectedRemoteFilter(remote);
  };
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClearFilters = () => {
    setSelectedJobTypeFilter('');
    setSelectedPayTypeFilter('');
    setSelectedRemoteFilter('');
    setFilterOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
  }

  return (
    <>
        <div className='bg-dark text-white' style={{ width: '100%', zIndex: '1000'}}>
          <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
              <Link to="/user-dashboard" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
            </h2>
            <ul className='list-unstyled' style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', margin: 0 }}>
              {navbarItems?.map((item) => (
                <li key={item.url} style={{ marginInline: '1em' }}>
                  <Link to={`/${item.url}`} style={{ color: 'white', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to = '/' style={{ marginLeft: 'auto' }}>
          <button type='button' className='btn btn-danger' id='sidebarCollapse' onClick={handleLogout}>
            Logout
          </button>
          </Link>
          </div>
        </div>

        <div id="content" style={{ marginTop: '60px' }}>
          <div className="container mt-4">
            <div className="row mt-3">
              <div className="col-md-8 offset-md-3">
                <div className="input-group">
                  <input
                    type="text"
                    id="searchInput"
                    className="form-control"
                    placeholder="Search by Title, Description, or Qualifications"
                    value={searchInput}
                    onChange={handleInputChange}
                  />
                  <div className="input-group-append" >
                    <button className="btn btn-outline-secondary" style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "lavender" }} type="button" onClick={handleFilterToggle}>
                      Filter
                    </button>
                    <button className="btn btn-outline-secondary" type="button" style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "lavender" }} onClick={handleClearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {filterOpen && (
              <div className="row mt-3">
                <div className="col-md-8 offset-md-2">
                  <div className="btn-group" role="group" aria-label="Filter by Job Type">
                    <button
                      type="button"
                      className={`btn ${selectedJobTypeFilter === 'Full-Time' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleJobTypeFilterChange('Full-Time')}
                    >
                      Full-Time
                    </button>
                    <button
                      type="button"
                      
                      className={`btn ${selectedJobTypeFilter === 'Part-Time' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleJobTypeFilterChange('Part-Time')}
                    >
                      Part-Time
                    </button>
                    <button
                      type="button"
                      style={{marginRight: '5px'}}
                      className={`btn ${selectedJobTypeFilter === 'Contract' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleJobTypeFilterChange('Contract')}
                    >
                      Contract
                    </button>
                  </div>

                  <div className="btn-group" role="group" aria-label="Filter by Pay Type">
                    <button
                      type="button"
                      className={`btn ${selectedPayTypeFilter === 'Salary' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handlePayTypeFilterChange('Salary')}
                    >
                      Salary
                    </button>
                    <button
                      type="button"
                      style={{marginRight: '5px'}}
                      className={`btn ${selectedPayTypeFilter === 'Hourly' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handlePayTypeFilterChange('Hourly')}
                    >
                      Hourly
                    </button>
                  </div>

                  <div className="btn-group" role="group" aria-label="Filter by Remote">
                    <button
                      type="button"
                      className={`btn ${selectedRemoteFilter === 'Remote' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleRemoteFilterChange('Remote')}
                    >
                      Remote
                    </button>
                    <button
                      type="button"
                      style={{marginRight: '5px'}}
                      className={`btn ${selectedRemoteFilter === 'On-Site' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => handleRemoteFilterChange('On-Site')}
                    >
                      On-Site
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-center mt-5">
              <h2><strong>Jobs</strong></h2>
            </div>

            <div className="row mt-4">
              {filteredJobs.map((job) => (
                <div className='col-md-4' key={job._id}>
                  <Link to='/job-details' state={{id: job._id}} className="btn btn-success mr-2" style={{ borderColor: 'transparent',textDecoration: 'none', backgroundColor: 'transparent'}}>
                    <div className='card' style={{ width: '23rem', cursor: 'pointer', height: '350px' }}>
                      <h5 className='card-img-top' style={{ alignContent: 'center', height: '200px', fontSize: 'clamp(1.5rem, 4vw, 3rem)', backgroundImage: 'linear-gradient(to bottom, #222725, #ACAEAD)', color: 'white' }}>{job.title} </h5>
                      <div className='card-body' style={{maxHeight: '150px', overflow: 'hidden' }}>
                        <h5 className='card-title'>{job.employer}</h5>
                        <ReactMarkdown>{job.description}</ReactMarkdown>
                      </div>
                    </div>
                  </Link>
                </div>
              
              ))}
            </div>
          </div>
        </div>
    </>
  );
};

export default JobsPage;
