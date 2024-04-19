import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ScholarshipEssay = () => {
    const navbar = [
        { title: "Dashboard", url: "user-dashboard" },
        { title: "Jobs", url: "userJobs" },
        { title: "Scholarships", url: "userScholarships" },
        { title: "Profile", url: "profile" },
    ];
    const navigate = useNavigate();
    const [formData, setFormData] = useState("");
    const location = useLocation();
    const schol = location.state;
    const userID = localStorage.getItem('_id');

    const handleSubmit = async() => {
        const updatedSchol = { ...schol };
        updatedSchol.submittedessays.push(userID+"\n"+formData); // entries first line is id of user who submitted
        try {
          await axios.put(`https://nami-backend.onrender.com/api/scholarship/update/${schol._id}`, updatedSchol);
        } catch (error) {
          console.error("Error saving scholarship essay to scholarship document", error);
        }

        try {
          const res = await axios.get(`https://nami-backend.onrender.com/api/profile/fetch/${userID}`);
          const updatedProfile = { ...res.data };
          updatedProfile.submittedessays.push(schol._id+"\n"+formData); // entries first line is id of scholarship submitted to
          await axios.put(`https://nami-backend.onrender.com/api/profile/update/${userID}`, updatedProfile);
        } catch (error) {
          console.error("Error saving scholarship essay to user profile document", error);
        }
        navigate("/userScholarships")
    };

    const handleFormDataChange = (event) => {
      setFormData(event.target.value);
    };

    return (
        <>
        <div className='bg-dark text-white'>
        <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
              <Link to='/user-dashboard' style={{ color: 'white', textDecoration: 'none' }}>
                ED OP
              </Link>
            </h2>
            <ul className='list-unstyled' style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', margin: 0 }}>
              {navbar?.map((item) => (
                <li key={item.url} style={{ marginInline: '1em' }}>
                  <Link to={`/${item.url}`} style={{ color: 'white', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to='/'>
            <button type='button' className='btn btn-danger' id='sidebarCollapse'>
              Logout
            </button>
          </Link>
        </div>
      </div>
        <div style={{padding: '20px'}}>
            <form className="col-md-6">
                <div className="form-group" style={{display: 'flex', flexDirection: 'column', marginTop: 0, width: '150%'}}>
                    <label>Essay</label>
                    <textarea rows="5" value={formData} onChange={handleFormDataChange}></textarea>

                </div>
            </form>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{marginTop: '10px'}}>Submit</button>
        </div>
        </>
    );
};

export default ScholarshipEssay;