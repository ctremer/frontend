import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const navigate = useNavigate();
  const id = localStorage.getItem('_id');

  useEffect(() => {
    // Fetch current user academic data and set the form
    const fetchPersonalInfo = async () => {
      try {
        const res = await axios.get(`https://edoponline.netlify.app/api/Profile/fetch/${id}`);
        setFormData(res.data);
      } catch (error) {
        console.error('Error fetching academic data:', error);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the registration data to the server
      const response = await axios.put(`https://edoponline.netlify.app/api/Profile/update/${id}`, formData);

      // Handle the response, e.g., show a success message
      console.log('Personal Information Successfully Updated', response.data);

      // Navigate to the next page after successful registration
      navigate('/profile'); // Change '/next-page' to the actual route you want to navigate to
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Failed to Update Personal Information', error.message);
    }
  };

  return (
    <div className="container">
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
