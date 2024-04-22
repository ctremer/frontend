import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const navbarItems = [
    { title: 'Dashboard', url: 'user-dashboard' },
    { title: 'Jobs', url: 'userJobs' },
    { title: 'Scholarships', url: 'userScholarships' },
    { title: 'Profile', url: 'profile' },
  ];

const JobApply = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        experience: "",
        whyFit: ""
    });
    const userID = localStorage.getItem('_id');
    const location = useLocation();
    const job = location.state;

    const auth = localStorage.getItem('auth');

    useEffect(() => {
      if (!auth) {
        return navigate('/login');
      }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        const updatedJob = { ...job };
        const application = {
          userid: userID,
          name: formData.name,
          dob: formData.dob,
          essay1: formData.experience,
          essay2: formData.whyFit
        };
        updatedJob.submittedapplications.push(application);
        try {
          await axios.put(`https://nami-backend.onrender.com/api/job/update/${job._id}`, updatedJob);
        } catch (error) {
          console.error("Error saving user application to job document", error);
        }

        const application2 = {
          jobid: job._id,
          essay1: formData.experience,
          essay2: formData.whyFit
        };
        try {
          const res = await axios.get(`https://nami-backend.onrender.com/api/profile/fetch/${userID}`);
          const updatedProfile = { ...res.data };
          updatedProfile.submittedjobapplications.push(application2);
          await axios.put(`https://nami-backend.onrender.com/api/profile/update/${userID}`, updatedProfile);
        } catch (error) {
          console.error("Error saving job application to user profile document", error);
        }
        navigate("/userJobs");
    };

    const goBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
      localStorage.removeItem('auth');
    }

    const populateWorkExperience = async () => {
      try {
          const res = await axios.get(`https://nami-backend.onrender.com/api/profile/fetch/${userID}`);
          const employmentHistory = res.data.employmentHistory;
          console.log(employmentHistory)
          const workExperienceText = employmentHistory.join('\n -'); // Assuming employmentHistory is an array of strings
          setFormData({
              ...formData,
              experience: workExperienceText
          });
      } catch (error) {
          console.error("Error fetching employment history:", error);
      }
  };

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
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>Previous Work Experience</label>
                    <textarea rows="3" className="form-control" name="experience" value={formData.experience} onChange={handleChange}></textarea>
                    <button type="button" className="btn btn-secondary" onClick={populateWorkExperience} style={{ marginTop: '10px' }}>Populate Work Experience</button>
                </div>
                <div className="form-group">
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>Why are you a good fit for the job?</label>
                    <textarea rows="5" className="form-control" name="whyFit" value={formData.whyFit} onChange={handleChange}></textarea>
                </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
            <button type="button" className="btn btn-secondary" onClick={goBack} style={{ marginTop: '10px', marginLeft: '5px' }}>Back</button>
        </div>
    </>
        
        
        

        
    );
};

export default JobApply;
