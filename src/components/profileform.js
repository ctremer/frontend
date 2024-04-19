// components/ProfileForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    academicHistory: '',
    employmentHistory: '',
    skills: '',
  });

  useEffect(() => {
    // Fetch current user profile data and set the form
    const fetchProfileData = async () => {
      const res = await axios.get('/api/profile');
      setFormData(res.data);
    };

    fetchProfileData();
  }, []);

  const { academicHistory, employmentHistory, skills } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    // Update user profile
    await axios.put('/api/profile', formData);
    // Add any additional logic, e.g., show success message
  };

  return (
    <form onSubmit={onSubmit}>
      <label>Academic History:</label>
      <input type="text" name="academicHistory" value={academicHistory} onChange={onChange} />
      <label>Employment History:</label>
      <input type="text" name="employmentHistory" value={employmentHistory} onChange={onChange} />
      <label>Skills:</label>
      <input type="text" name="skills" value={skills} onChange={onChange} />
      <button type="submit">Save Profile</button>
    </form>
  );
};

export default ProfileForm;
