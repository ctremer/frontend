import React from 'react';
import { Link } from 'react-router-dom';
import filterPic from './screenshots/filterPic.png';
import dashboardPic from './screenshots/dashboardPic.png';
import detailPic from './screenshots/detailPic.png';

const Home = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{textAlign: 'center'}}>ED OP Online</h1>
        <Link to="/login">
          <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Sign In</button>
        </Link>
      </div>
      <p style={{ marginTop: '20px' }}>
        Connecting students with education-based opportunities like scholarships or student-employment positions.
      </p>
      <div style={{ marginTop: '20px' }}>
        <video width="100%" controls>
          <source src="" type="video/mp4" />
        </video>
      </div>
      <div>
        <h3>ED OP Online was created to give students the ability to easily navigate
          financial opportunities while they pursue their degree. College can be very
          financially burdening, and navigating the various employment and scholarship
          opportunities available to students is an essential yet cumbersome task.
          ED OP Online consolidates these opportunities to one
          central location making searching, choosing, and applying to a job or scholarship
          simple giving more students the ability to obtain their degree worry free.
        </h3>
        <Link to="/signup">
          <button style={{width: '600px',backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>Sign Up Now!</button>
        </Link>
        <Link to="/about">
          <button style={{width: '600px',backgroundColor: '#19EE60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>About the Creators</button>
        </Link>
      </div>
      <div>
      <h4 style={{marginTop: "50px"}}>See new postings for jobs and scholarships in a central location</h4>
      <img style={{maxWidth: "600px",  border: '2px solid #000000'}}src={dashboardPic} alt="Screenshot" />
    </div>
    <div>
      <h4 style={{marginTop: "50px"}}>Quickly filter results to suit your needs</h4>
      <img style={{maxWidth: "600px",  border: '2px solid #000000'}} src={filterPic} alt="Screenshot" />
    </div>
    <div>
      <h4 style={{marginTop: "50px"}}>See an organized and detailed description to get the best insight into the posting</h4>
      <img style={{maxWidth: "600px",  border: '2px solid #000000'}} src={detailPic} alt="Screenshot" />
    </div>
      <footer style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>© Copyright 2024 CSCE492 Nami Group</p>
      </footer>
    </div>
  );
};

export default Home;
