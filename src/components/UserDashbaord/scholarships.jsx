import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Style/styles.css'; 
import projectImage from './scholarship_images/stanford.png';
import ReactMarkdown from 'react-markdown';

const navbarItems = [
  { title: 'Dashboard', url: 'user-dashboard' },
  { title: 'Jobs', url: 'userJobs' },
  { title: 'Scholarships', url: 'userScholarships' },
  { title: 'Profile', url: 'profile' },
];

const ScholarshipsPage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOpenDate, setFilterOpenDate] = useState('');
  const [filterDeadline, setFilterDeadline] = useState('');

  const navigate = useNavigate();

  const auth = localStorage.getItem('auth');

  useEffect(() => {
    if (!auth) {
      return navigate('/login');
    }
  });

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axios.get('https://nami-backend.onrender.com/api/scholarship/fetch');
        setScholarships(response.data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    filterScholarships(searchInput, filterOpenDate, filterDeadline);
  }, [searchInput, scholarships, filterOpenDate, filterDeadline]);

  const filterScholarships = (input, openDate, deadline) => {
    const filtered = scholarships.filter((scholarship) => {
      const titleMatch = scholarship.title.toLowerCase().includes(input.toLowerCase());
      const descriptionMatch = scholarship.description.toLowerCase().includes(input.toLowerCase());
      const qualificationsMatch = scholarship.qualifications.toLowerCase().includes(input.toLowerCase());
      const isOpenDatePassed = !openDate || new Date(scholarship.openDate) > new Date(openDate);
      const isDeadlinePassed = !deadline || new Date(scholarship.deadline) < new Date(deadline);
      return (titleMatch || descriptionMatch || qualificationsMatch) && isOpenDatePassed && isDeadlinePassed;
    });
    setFilteredScholarships(filtered);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleOpenDateFilterChange = (e) => {
    setFilterOpenDate(e.target.value);
  };

  const handleDeadlineFilterChange = (e) => {
    setFilterDeadline(e.target.value);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilterOpenDate('');
    setFilterDeadline('');
    setFilterOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
  }

  return (
    <>
        <div className='bg-dark text-white' style={{ width: '100%', zIndex: '1000' }}>
          <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <div className="row mt-4">
                <div className="col-md-6 offset-md-3">
                  <label htmlFor="openDateFilter">Filter by Open Date: (Shows scholarships that open after the date selected) </label>
                  <input
                    type="date"
                    id="openDateFilter"
                    className="form-control"
                    value={filterOpenDate}
                    style = {{ marginTop: "-50px"}}
                    onChange={handleOpenDateFilterChange}
                  />
                  <label htmlFor="deadlineFilter">Filter by Deadline: (Shows scholarships whose deadlines are before the date selected) </label>
                  <input
                    type="date"
                    id="deadlineFilter"
                    className="form-control"
                    value={filterDeadline}
                    style = {{ marginTop: "-50px"}}
                    onChange={handleDeadlineFilterChange}
                  />
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center mt-5">
              <h2><strong>Scholarships</strong></h2>
            </div>
            <div className="row mt-4">
              {filteredScholarships.map((scholarship) => (
                <div className='col-md-4' key={scholarship._id}>
                  <Link to='/scholarship-details' state={{id: scholarship._id, isAdmin: false}} className="btn btn-success mr-2" style={{ borderColor: 'transparent',textDecoration: 'none', backgroundColor: 'transparent'}}>
                    <div className='card' style={{ width: '23rem', height: '350px' }}>
                      <h5 className='card-img-top' style={{ height: '200px', fontSize: 'clamp(1.5rem, 4vw, 3rem)', backgroundImage: 'linear-gradient(to bottom, #222725, #ACAEAD)', color: 'white', alignContent: 'center' }}>{scholarship.title} </h5>
                      <div className='card-body' style={{maxHeight: '150px', overflow: 'hidden' }}>
                      <h5 className='card-title'> Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-US')}</h5>
                        <ReactMarkdown>{scholarship.description}</ReactMarkdown>
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

export default ScholarshipsPage;
