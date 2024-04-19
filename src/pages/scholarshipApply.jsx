import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const navbarItems = [
    { title: 'Dashboard', url: 'user-dashboard' },
    { title: 'Jobs', url: 'userJobs' },
    { title: 'Scholarships', url: 'userScholarships' },
    { title: 'Profile', url: 'profile' },
  ];

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

    return (
        <>
      <div className="wrapper">
      <div className='bg-dark text-white' style={{ position: 'fixed', width: '100%'}}>
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
          <button type='button' className='btn btn-danger' id='sidebarCollapse'>
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
                    <label style={{marginTop: "10px", marginBottom:"0px"}}>What university do you attend?</label>
                    <textarea rows="1" className="form-control" name="university" value={formData.university} onChange={handleChange}></textarea>
                </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>Submit</button>
            <button type="button" className="btn btn-secondary" onClick={goBack} style={{ marginTop: '10px', marginLeft: '5px' }}>Back</button>
        </div>
      </div>
    </>
        
    );
};

export default scholarshipApply;
