import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EditAddProfile = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    academicHistory: '',
    employmentHistory: '',
    skills: '',
    // Add other fields based on your schema
    college: '',
    major: '',
    achievements: '',
    gpa: '',
    minor: '',
    yearattended: '',
    yearcompletion: '',
    jobtitle: '',
    companies: '',
    dateofemployment: '',
    responsibilities: '',
    certifications: ''
  });

  useEffect(() => {
    if (location.state && location.state.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (location.state && location.state.formData) {
        await axios.put(`http://localhost:5000/api/profile/update/${formData.id}`, formData);
      } else {
        await axios.post(`http://localhost:5000/api/profile/create`, formData);
      }
      // Redirect or perform other actions after successful submission
    } catch (error) {
      console.error('Error submitting profile:', error);
      // Handle errors
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Academic History:</label>
      <input type="text" name="academicHistory" value={formData.academicHistory} onChange={handleChange} />

      <label>Employment History:</label>
      <input type="text" name="employmentHistory" value={formData.employmentHistory} onChange={handleChange} />

      <label>Skills:</label>
      <input type="text" name="skills" value={formData.skills} onChange={handleChange} />

      {/* Add other input fields based on your schema */}
      <label>College:</label>
      <input type="text" name="college" value={formData.college} onChange={handleChange} />

      <label>Major:</label>
      <input type="text" name="major" value={formData.major} onChange={handleChange} />

      <label>Achievements:</label>
      <input type="text" name="achievements" value={formData.achievements} onChange={handleChange} />

      <label>GPA:</label>
      <input type="number" name="gpa" value={formData.gpa} onChange={handleChange} />

      <label>Minor (if any):</label>
      <input type="text" name="minor" value={formData.minor} onChange={handleChange} />

      {/* Add other input fields */}

      <button type="submit">Save Profile</button>
    </form>
  );
};

export default EditAddProfile;
