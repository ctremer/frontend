import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/Style/styles.css';


const CreateAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [verificationUsername, setVerificationUsername] = useState('');
  const [verificationPassword, setVerificationPassword] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          confirmPassword,
          birthday,
          role: 'admin',
        }),
      });
  
      const responseBody = await response.json();
  
      if (response.ok) {
        // Signup successful
        console.log('Signup successful:', responseBody);
  
        const { user } = responseBody;
  
        console.log('user', user);
  
        localStorage.setItem('_id', user);
  
        // Redirect to login or wherever needed
        navigate('/admin-dashboard');
      } else {
        // Signup failed
        console.error('Signup error:', responseBody.error);
        // Set the error state to display the error message
        setError(responseBody.error);
      }
    } catch (error) {
      // Unexpected error during signup
      console.error('Unexpected error during signup:', error);
      // Handle unexpected errors
      setError('Unexpected error during signup');
    }
  };
  

  const toggleVerificationForm = () => {
    setVerificationVisible(!verificationVisible);
  };

  const handleVerification = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: verificationUsername,
          password: verificationPassword,
        }),
      });

      const responseBody = await response.json();

      if (response.ok) {
        // Verification successful
        handleCreate();
      } else {
        // Verification failed
        console.error('Verification error:', responseBody.error);
        setError(responseBody.error);
      }
    } catch (error) {
      // Unexpected error during verification
      console.error('Unexpected error during verification:', error);
      setError('Unexpected error during verification');
    }
  };

  return (
    
    <div className="center-container">
      <h1 className="signup-title">Create New Admin</h1>
      <label htmlFor="username"></label>
      <input
        type="text"
        id="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <br></br>
      <label htmlFor="password"></label>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <br></br>
      <label htmlFor="confirmPassword"></label>
      <input
        type="password"
        id="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      ></input>
      <br></br>
      <label htmlFor="birthday"></label>
      <input
        type="date"
        id="birthday"
        placeholder="Birthday"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
      ></input>
      <br></br>
      {error && <p className="error-message">{error}</p>}<br></br>
      <button className="button-signup" onClick={toggleVerificationForm}>
        Next ➜
      </button>

      {verificationVisible && (
        <div>
          <h2>Admin Verification</h2>
          <label htmlFor="verificationUsername"></label>
          <input
            type="text"
            id="verificationUsername"
            placeholder="Admin Username"
            value={verificationUsername}
            onChange={(e) => setVerificationUsername(e.target.value)}
          ></input>
          <br></br>
          <label htmlFor="verificationPassword"></label>
          <input
            type="password"
            id="verificationPassword"
            placeholder="Admin Password"
            value={verificationPassword}
            onChange={(e) => setVerificationPassword(e.target.value)}
          ></input>
          <br></br>
          <button className="button-verify" onClick={handleVerification}>
            Verify Admin ➜
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateAdmin;
