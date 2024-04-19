import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

const Employment = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companies: '',
    dateOfEmployment: '',
    responsibilities: '',
    achievements: '',
    certifications: '',
  });

  const navigate = useNavigate();
  const id = localStorage.getItem('_id');

  useEffect(() => {
    // Fetch current user employment data and set the form
    const fetchEmploymentData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/fetch/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching employment data:', error);
      }
    };

    fetchEmploymentData();
  }, []);

  const { jobTitle, companies, dateOfEmployment, responsibilities, achievements, certifications } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    
    try {
      // Update user employment
      await axios.put(`http://localhost:5000/api/profile/update/${id}`, formData);

      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error updating employment information:', error);
    }
  };

  return (
    <>
        <div className="wrapper d-flex">
        <div style={{ flex: 1, padding: '20px' }}>
          <form onSubmit={submitForm} className="col-md-6" style={{ marginTop: '70px' }}>
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title:</label>
              <input
                type="text"
                className="form-control"
                id="jobTitle"
                name="jobTitle"
                value={jobTitle}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="companies">Companies:</label>
              <input
                type="text"
                className="form-control"
                id="companies"
                name="companies"
                value={companies}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfEmployment">Date of Employment:</label>
              <input
                type="text"
                className="form-control"
                id="dateOfEmployment"
                name="dateOfEmployment"
                value={dateOfEmployment}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="responsibilities">Responsibilities:</label>
              <textarea
                className="form-control"
                id="responsibilities"
                name="responsibilities"
                value={responsibilities}
                onChange={onChange}
                rows="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="achievements">Achievements:</label>
              <textarea
                className="form-control"
                id="achievements"
                name="achievements"
                value={achievements}
                onChange={onChange}
                rows="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="certifications">Certifications:</label>
              <textarea
                className="form-control"
                id="certifications"
                name="certifications"
                value={certifications}
                onChange={onChange}
                rows="6"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">Save Info</button>
              {/* Add other buttons or actions if needed */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Employment;
