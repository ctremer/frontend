import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    
    <div style={{ backgroundColor: '#353B3B', height: '1000px', width: '200px', paddingTop: '56px' }}>
      <h3 style={{ color: 'white', marginLeft: '10px' }}>Profile Tabs</h3>
      
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/profile/personal-info" style={{ color: 'white', marginLeft: '10px' }}>Personal Info</Link>
        </li>       
        <li>
          <Link to="/profile/academics-experience" style={{ color: 'white', marginLeft: '10px' }}>Academic Experience</Link>
        </li>
        <li>
          <Link to="/profile/employment-history" style={{ color: 'white', marginLeft: '10px' }}>Employment History</Link>
        </li>+
        
      </ul>  
    </div>
  );
};

export default Sidebar;
