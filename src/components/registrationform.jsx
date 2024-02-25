// components/registrationform.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: ''
  });

  const navigate=useNavigate();
  const id = localStorage.getItem('_id');
  console.log('user_id', id)


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the registration data to the server
      const response = await axios.post('/api/register', formData);

      // Handle the response, e.g., show a success message
      console.log('Registration successful!', response.data);
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add input fields for each piece of user information */}
      <label>First Name:</label>
      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
      
      <label>Last Name:</label>
      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />

      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;