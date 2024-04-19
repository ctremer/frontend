import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import linkedInLogo from './LinkedInLogo.png';
import gitHubLogo from './githubLogo.png';

const About = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{textAlign: 'center'}}>About the Creators</h1>
        <Link to="/login">
          <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Sign In</button>
        </Link>
      </div>
      <p style={{ marginTop: '20px', color:"#000000"}}>
        We are a group of students who are passionate about making the college experience
        simpler for everyone. Please reach out to us on LinkedIn and feel free to look
        at our source code at the GitHub link below.
      </p>
      <h2 style={{ marginTop: '50px', color:"#000000"}}> GitHub Repository {' '}
      <a href="https://github.com/SCCapstone/Nami.git" target="_blank" rel="noopener noreferrer">
      <img src={gitHubLogo} alt="GitHub" style={{ width: '50px', height: '50px', verticalAlign: 'middle' }} />
      </a>
      </h2>
        
      <div style={{textAlign: 'left', marginLeft: '280px',marginTop: '50px'}}>
        <h2>Carter Strubbe{' '}
        <a href="https://www.linkedin.com/in/carter-strubbe-b8b883178/" target="_blank" rel="noopener noreferrer">
        <img src={linkedInLogo} alt="LinkedIn" style={{width: '100px', height: '50px',verticalAlign: 'middle' }} />
        </a></h2>
        <h2>Collin Remer{' '}
        <a href="https://www.linkedin.com/in/collin-remer/" target="_blank" rel="noopener noreferrer">
        <img src={linkedInLogo} alt="LinkedIn" style={{width: '100px', height: '50px', verticalAlign: 'middle' }} />
        </a></h2>
        <h2>Tyrrell Wilkins{' '}</h2>
        
        <h2>Murray McDaniel{' '}</h2>
        
      </div>
      <button onClick={goBack} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>Go Back</button>
      <footer style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>© Copyright 2024 CSCE492 Nami Group</p>
      </footer>
    </div>
  );
};

export default About;
