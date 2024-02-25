import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', background: '#f1f1f1', padding: '20px' }}>
      <h3>Profile Tabs</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/profile/personal-info">Personal Info</Link>
        </li>       
        <li>
          <Link to="/profile/academics-experience">Academic Experience</Link>
        </li>
        <li>
          <Link to="/profile/employment-history">Employment History</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
