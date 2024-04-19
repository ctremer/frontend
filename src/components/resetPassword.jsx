import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Style/styles.css';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const id = localStorage.getItem('_id');

  const handleResetPassword = async () => {
    try {
  
      const response = await fetch(`https://edoponline.netlify.app/api/user/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
  
      const responseBody = await response.json();
  
      if (response.ok) {
        // Reset password successful
        console.log('Reset password successful:', responseBody);
  
        // Redirect to user dashboard
        navigate('/user-dashboard');
      } else {
        // Reset password failed
        console.error('Reset password error:', responseBody.error);
  
        // Set the error state to display the error message
        setError(responseBody.error);
      }
    } catch (error) {
      // Unexpected error during reset password
      console.error('Unexpected error during reset password:', error);
  
      // Handle unexpected errors
      setError('Unexpected error during reset password');
    }
  };
  return (
    <div className="center-container">
      <h1 className="signup-title">Reset Password</h1>
      <label htmlFor="currentPassword"></label>
      <input
        type="password"
        id="currentPassword"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <br />
      <label htmlFor="newPassword"></label>
      <input
        type="password"
        id="newPassword"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <br />
      <label htmlFor="confirmPassword"></label>
      <input
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <br />
      {error && <p className="error-message">{error}</p>}
      <br />
      <button className="button-signup" onClick={handleResetPassword}>
        Reset Password ➜
      </button>
    </div>
  );
};

export default ResetPassword;
