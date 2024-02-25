import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import image from '../assets/default_profile_picture.png';


const Profile = () => {
  const [formData, setFormData] = useState({
    academicHistory: '',
    employmentHistory: '',
    skills: '',
  });
  const navigate=useNavigate();
  const id = localStorage.getItem('_id');
  console.log('user_id', id)

  useEffect(() => {
    // Fetch current user profile data and set the form
    const fetchProfileData = async () => {
      const res = await axios.get(`http://localhost:5000/api/profile/fetch/${id}`);
      setFormData(res.data);
    };

    fetchProfileData();
  }, []);

  const { academicHistory, employmentHistory, skills } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitForm = async (e) => {
    e.preventDefault();
    // Update user profile
    console.log('submitted')//comment
    try {
      // Update user profile
      await axios.put(`http://localhost:5000/api/profile/update/${id}`, formData);

      // Show success message
      alert("Profile Update Successful");
      navigate('/user-dashboard');
      // Additional logic if needed
    } catch (error) {
      // Handle errors, e.g., show an error message
      //toast.error('An error occurred while updating the profile');
      alert('unable to submit form')
    }
  };
  const handleEditProfile = () => {
    // Redirect to the edit profile page
    navigate('/edit-profile');
  };

  const handleDeleteProfile = async () => {
    try {
      // Make a DELETE request to the delete profile API endpoint
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);

      // Show success message
      alert('Profile Deleted Successfully');

      // Redirect to the dashboard or perform any other necessary action
      navigate('/user-dashboard');
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error deleting profile:', error);
      alert('Unable to delete profile');
    }
  };

  const handleDeleteAccount = async () => {
    const userPassword = prompt('Enter your password to delete your account');
  
    if (userPassword === null) {
      // User canceled the prompt
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`, {
        data: { password: userPassword },
      });
  
      // Show success message
      alert('Account Deleted Successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Unable to delete account');
    }
  };

  const handleResetPassword = async () =>{
    navigate('../reset-password');
  }

  const imageRef = useRef(null);
  const updateProfilePicture = (event) => {
    event.preventDefault();
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onload = (event) => {
      imageRef.current.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className='bg-dark text-white' style={{ position: 'fixed', width: '100%', zIndex: '1000' }}>
        <div id='navbar' style={{ display: 'flex', paddingBlock: '.5em', alignItems: 'center', margin: '0 auto', maxWidth: '1200px' }}>
          <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
          </h2>
          <ul className='list-unstyled' style={{ display: 'flex', flexDirection: 'row', listStyle: 'none', margin: 0 }}>
            <li style={{ marginInline: '1em' }}>
              <Link to='/user-dashboard' style={{ color: 'white', textDecoration: 'none' }}>
                Dashboard
              </Link>
            </li>
            <li style={{ marginInline: '1em' }}>
              <Link to='/userJobs' style={{ color: 'white', textDecoration: 'none' }}>
                Jobs
              </Link>
            </li>
            <li style={{ marginInline: '1em' }}>
              <Link to='/userScholarships' style={{ color: 'white', textDecoration: 'none' }}>
                Scholarships
              </Link>
            </li>
            <li style={{ marginInline: '1em' }}>
              <Link to='/profile' style={{ color: 'white', textDecoration: 'none' }}>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrapper d-flex">
        {/* Sidebar */}
        <Sidebar />

      <div style={{ flex: 1, padding: '80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={image} ref={imageRef} style={{width: '20%', height: '20%', objectFit: 'cover' }}></img>
          {/* <button type="button" className="btn btn-primary" style={{width: '20%'}}onClick={updateProfilePicture}>Edit Profile Picture</button> */}
          <label>Edit profile picture:  </label>
          <input type="file" onChange={updateProfilePicture}></input>
        </div>
        <form onSubmit={submitForm} className="col-md-6" style={{ marginTop: '70px' }}>
          <div className="form-group">
            <label htmlFor="academicHistory">Academic History:</label>
            <textarea
              className="form-control"
              id="academicHistory"
              name="academicHistory"
              value={formData.academicHistory}
              onChange={onChange}
              rows="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="employmentHistory">Employment History:</label>
            <textarea
              className="form-control"
              id="employmentHistory"
              name="employmentHistory"
              value={formData.employmentHistory}
              onChange={onChange}
              rows="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="skills">Skills:</label>
            <textarea
              className="form-control"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={onChange}
              rows="6"
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" onClick={submitForm} className="btn btn-primary">Save Profile</button>
            <button type="button" className="btn btn-warning" onClick={() => navigate('/edit-profile')}>Edit Profile</button>
            <button type="button" className="btn btn-danger" style={{ marginTop: '20px' }} onClick ={handleDeleteAccount} >Delete Account</button>
            <button type="button" className="btn btn-danger" style={{ marginTop: '20px' }} onClick ={handleResetPassword} >Reset Password</button>
          </div>     
        </form>
        </div>
      </div>
    </>
  );
};

export default Profile;