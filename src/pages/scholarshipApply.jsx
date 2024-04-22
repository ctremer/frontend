import React, { useState } from "react";
import axios from 'axios';

import { useNavigate, Link } from "react-router-dom";

const navbarItems = [
    { title: 'Dashboard', url: 'user-dashboard' },
    { title: 'Jobs', url: 'userJobs' },
    { title: 'Scholarships', url: 'userScholarships' },
    { title: 'Profile', url: 'profile' },
  ];

const userID = localStorage.getItem('_id');
const scholarshipApply = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gpa: "",
        major: "",
        university: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        navigate("/userScholarships");
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
      localStorage.removeItem('auth');
    }

    const populateAcademicExperience = async () => {
      try {
          const res = await axios.get(`https://nami-backend.onrender.com/api/profile/fetch/${userID}`);
          const academicHistory = res.data.academicHistory;
          console.log(academicHistory)
          const acadExperienceText = academicHistory.join('\n -');
          setFormData({
              ...formData,
              university: acadExperienceText
          });
      } catch (error) {
          console.error("Error fetching academic history:", error);
      }
    }

    return (
        <>
      <div className='bg-dark text-white' style={{ zIndex: '1000', width: '100%'}}>
          <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
              <Link to="/user-dashboard" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
            </h2>
            <ul className='list-unstyled' style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', margin: 0 }}>
              {navbarItems?.map((item) => (
                <li key={item.url} style={{ marginInline: '1em' }}>
                  <Link to={`/${item.url}`} style={{ color: 'white', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to = '/' style={{ marginLeft: 'auto' }}>
          <button type='button' className='btn btn-danger' id='sidebarCollapse' onClick={handleLogout}>
            Logout
          </button>
          </Link>
          </div>
        </div>
        <div style={{ padding: '20px' }}>
            <form style={{width:"500px"}}>
                <div className="form-group">
                    <label style={{marginTop: "100px", marginBottom:"0px"}}>Name</label>
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>Date of Birth</label>
                    <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>What is your GPA?</label>
                    <textarea rows="1" className="form-control" name="gpa" value={formData.gpa} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>What is your major?</label>
                    <textarea rows="1" className="form-control" name="major" value={formData.major} onChange={handleChange}></textarea>
                    
                </div>
                <div className="form-group">
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>Academic History</label>
                    <textarea rows="1" className="form-control" name="university" value={formData.university} onChange={handleChange} style={{height:"100px"}}></textarea>
                    <button type="button" className="btn btn-secondary" onClick={populateAcademicExperience} style={{ marginTop: '10px' }}>Populate Academic History</button>
                </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
            <button type="button" className="btn btn-secondary" onClick={goBack} style={{ marginTop: '10px', marginLeft: '5px' }}>Back</button>
        </div>
    </>
        
    );
};

export default scholarshipApply;
