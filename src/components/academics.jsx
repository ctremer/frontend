// Import React and any necessary modules
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const Academic = () => {
  const [formData, setFormData] = useState({
    College: '',
    Major: '',
    Achievement: '',
    GPA: '',
    minor: '',
    yearAttended: '',
    yearCompletion: '',
  });

  const navigate = useNavigate();
  const id = localStorage.getItem('_id');

  useEffect(() => {
    // Fetch current user academic data and set the form
    const fetchAcademicData = async () => {
      try {
        const res = await axios.get(`https://edoponline.netlify.app/api/Profile/fetch/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching academic data:', error);
      }
    };

    fetchAcademicData();
  }, []);

  const { College, Major, Achievement, GPA, minor, yearAttended, yearCompletion } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    
    try {
      // Update user academic data
      await axios.put(`https://edoponline.netlify.app/api/Profile/update/${id}`, formData);

      // Show success message
      navigate('/profile');
    } catch (error) {
      console.error('Error updating academic information:', error);
    }
  };

  // Generate year options for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, index) => currentYear - index);

  return (
    <>
      <div className="wrapper d-flex">
        <div style={{ flex: 1, padding: '20px' }}>
          <form onSubmit={submitForm} className="col-md-6" style={{ marginTop: '70px' }}>
            <div className="form-group">
              <label htmlFor="College">College:</label>
              <input
                type="text"
                className="form-control"
                id="College"
                name="College"
                value={College}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Major">Major:</label>
              <input
                type="text"
                className="form-control"
                id="Major"
                name="Major"
                value={Major}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Achievement">Achievement:</label>
              <input
                type="text"
                className="form-control"
                id="Achievement"
                name="Achievement"
                value={Achievement}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="GPA">GPA:</label>
              <input
                type="number"
                className="form-control"
                id="GPA"
                name="GPA"
                step="0.01"
                value={GPA}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="minor">Minor (if any):</label>
              <input
                type="text"
                className="form-control"
                id="minor"
                name="minor"
                value={minor}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="yearAttended">Year Attended:</label>
              <select
                id="yearAttended"
                name="yearAttended"
                value={yearAttended}
                onChange={onChange}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="yearCompletion">Year of Completion:</label>
              <select
                id="yearCompletion"
                name="yearCompletion"
                value={yearCompletion}
                onChange={onChange}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Save Info</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Academic;
