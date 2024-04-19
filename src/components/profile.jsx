import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/default_profile_picture.png';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const navbar = [
  { title: "Dashboard", url: "user-dashboard" },
  { title: "Jobs", url: "userJobs" },
  { title: "Scholarships", url: "userScholarships" },
  { title: "Profile", url: "profile" },
];

const Profile = () => {
  const [profile, setProfile] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bioEditMode, setBioEditMode] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedField, setEditedField] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [showAddAcademicHistory, setShowAddAcademicHistory] = useState(false);
  const [newAcademicHistory, setNewAcademicHistory] = useState('');
  const [showAddEmploymentHistory, setShowAddEmploymentHistory] = useState(false);
  const [newEmploymentHistory, setNewEmploymentHistory] = useState('');
  const [showAddSkills, setShowAddSkills] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const id = localStorage.getItem('_id');
  
  useEffect(() => {
    setEditedValue(profile.bio || ''); // Use an empty string as the default value if profile.bio is undefined
  }, [profile.bio]);

  useEffect(() => {
    setProfilePicture(profile.profilepicture || image);
  }, [profile.profilepicture])

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('_id');
        const res = await axios.get(`https://edoponline.netlify.app/api/profile/fetch/${userId}`);
        setProfile(res.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleDeleteAccount = async () => {
    const userPassword = prompt('Enter your password to delete your account');

    if (userPassword === null) {
      return;
    }

    try {
      await axios.delete(`https://edoponline.netlify.app/api/user/delete/${id}`, {
        data: { password: userPassword },
      });

      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const updateProfilePicture = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    try {
      const creds = {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      };
      const s3 = new S3Client({
        credentials: creds,
        region: import.meta.env.VITE_AWS_REGION,
      });
      
      const params = {
        Bucket: 'nami-ep-od-profile-photos',
        Key: file.name,
        Body: file,
        ContentType: file.type
      };
      const data = await s3.send(new PutObjectCommand(params));
      console.log(data);
      // handleSaveProfilePicture(data);
    } catch (error) {
      console.error("Error uploading photo to S3", error);
    }
    handleSaveProfilePicture(file);
  };
  
  const handleSaveProfilePicture = async (file) => {
    const fileURL = 'https://nami-ep-od-profile-photos.s3.us-east-2.amazonaws.com/' + file.name;
    try {
      const updatedProfile = { ...profile, profilepicture: fileURL};
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error saving profile picture", error);
    }
  };

  const handleEdit = (field, value, index) => {
    setEditMode(true);
    setBioEditMode(false);
    setEditedValue(value);
    setEditedIndex(index);
    setEditedField(field);
  };

  const handleEditBio = () => {
    setBioEditMode(true);
    setEditedBio(profile.bio || ''); // Use an empty string as the default value if profile.bio is undefined
  };
  
  useEffect(() => {
    setEditedBio(profile.bio || ''); // Use an empty string as the default value if profile.bio is undefined
  }, [profile.bio]);

  const handleSaveBio = async () => {
      profile.bio = editedBio;
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, profile);
      setBioEditMode(false);
  }

  const handleSave = async () => {
    try {
      const updatedProfile = { ...profile, bio: editedBio };
      updatedProfile[editedField][editedIndex] = editedValue;
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setBioEditMode(false);
  };

  const handleDeleteEntry = async (field, index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      try {
        const updatedProfile = { ...profile };
        updatedProfile[field].splice(index, 1);
        await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
        setProfile(updatedProfile);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleAddAcademicHistory = () => {
    setShowAddAcademicHistory(true);
  };

  const handleSaveNewAcademicHistory = async () => {
    try {
      if (newAcademicHistory != "") {
        const updatedProfile = { ...profile };
        updatedProfile.academicHistory.push(newAcademicHistory.replace(/\n/g, '<br>'));
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
      setProfile(updatedProfile);
      setShowAddAcademicHistory(false);
      setNewAcademicHistory('');

      }
      
    } catch (error) {
      console.error('Error adding academic history:', error);
    }
  };

  const handleCancelAddAcademicHistory = () => {
    setShowAddAcademicHistory(false);
    setNewAcademicHistory('');
  };

  const handleAddEmploymentHistory = () => {
    setShowAddEmploymentHistory(true);
  };

  const handleSaveNewEmploymentHistory = async () => {
    try {
      if (newEmploymentHistory != "") {
        const updatedProfile = { ...profile };
        updatedProfile.employmentHistory.push(newEmploymentHistory.replace(/\n/g, '<br>'));
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
      setProfile(updatedProfile);
      setShowAddEmploymentHistory(false);
      setNewEmploymentHistory('');

      }
      
    } catch (error) {
      console.error('Error adding employment history:', error);
    }
  };

  const handleCancelAddEmploymentHistory = () => {
    setShowAddEmploymentHistory(false);
    setNewEmploymentHistory('');
  };

  const handleAddSkill = () => {
    setShowAddSkills(true);
  };

  const handleSaveNewSkill = async () => {
    try {
      if (newSkill != "") {
        const updatedProfile = { ...profile };
        updatedProfile.skills.push(newSkill.replace(/\n/g, '<br>'));
      await axios.put(`https://edoponline.netlify.app/api/profile/update/${id}`, updatedProfile);
      setProfile(updatedProfile);
      setShowAddSkills(false);
      setNewSkill('');
      }
      
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleCancelAddSkill = () => {
    setShowAddSkills(false);
    setNewSkill('');
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '80px' }}>
        <div style={{ width: '200px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={profilePicture} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
            <label>Edit profile picture: </label>
            <input type="file" onChange={updateProfilePicture} accept=".png" />
          </div>
          <div style={{ marginTop: '20px', background: 'white', padding: '10px', borderRadius: '10px', minHeight: '450px' }}>
            <strong>Bio:</strong> {bioEditMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                style={{ flex: 1, resize: 'none', minHeight: '350px' }} // Allow the textarea to take up remaining space
              />
              <div style={{ alignSelf: 'flex-end' }}> {/* Align buttons to the flex-end */}
                <button className='btn btn-primary' onClick={handleSaveBio}>Save</button>
                <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', height: '100%', wordWrap: 'break-word' }}> {/* Apply word-wrap: break-word */}
              {profile.bio}
              <button className='btn btn-secondary' style={{alignSelf: 'flex-end'}} onClick={handleEditBio}>Edit</button> {/* Position the button to the bottom right */}
            </div>
          )}

          </div>
        </div>
        
        <div style={{ flex: 1, marginLeft: '50px' }}>
        <div style={{ marginBottom: '20px', background: 'white', padding: '10px', borderRadius: '10px', position: 'relative' }}>
          <strong>Academic History:</strong>
          {profile.academicHistory && profile.academicHistory.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && (
                <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px', position: 'relative', paddingRight: '100px' }}>
                  {editMode && editedField === 'academicHistory' && editedIndex === index ? (
                    <div>
                      <textarea style={{textAlign: 'left', minHeight: '200px', minWidth: '900px'}} value={editedValue} onChange={(e) => setEditedValue(e.target.value)} />
                      <button style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '30px' }} className='btn btn-primary' onClick={handleSave}>Save</button>
                      <button style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '30px' }} className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ width: 'calc(100% - 120px)', whiteSpace: 'pre-wrap' }}> {/* Adjusted width */}
                      {item.replace(/<br>/g, '\n')}
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                    <button style={{ marginRight: '5px' }} className='btn btn-secondary' onClick={() => handleEdit('academicHistory', item, index)}>Edit</button>
                    <button className='btn btn-danger' onClick={() => handleDeleteEntry('academicHistory', index)}>Delete</button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}


          <div style={{ alignSelf: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleAddAcademicHistory}>Add</button>
          </div>
        </div>



        <div style={{ marginBottom: '20px', background: 'white', padding: '10px', borderRadius: '10px', position: 'relative' }}>
          <strong>Employment History:</strong>
          {profile.employmentHistory && profile.employmentHistory.map((item, index) => (
            <React.Fragment key={index}>
              {index !== 0 && (
              <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px', position: 'relative', paddingRight: '100px' }}>
                {editMode && editedField === 'employmentHistory' && editedIndex === index ? (
                  <div>
                    <textarea style={{textAlign: 'left', minHeight: '200px', minWidth: '900px'}} value={editedValue} onChange={(e) => setEditedValue(e.target.value)} />
                    <button style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '30px' }} className='btn btn-primary' onClick={handleSave}>Save</button>
                    <button style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '30px' }} className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ width: 'calc(100% - 120px)', whiteSpace: 'pre-wrap' }}> {/* Adjusted width */}
                      {item.replace(/<br>/g, '\n')}
                    </div>
                )}
                <div style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                  <button style={{ marginRight: '5px' }} className='btn btn-secondary' onClick={() => handleEdit('employmentHistory', item, index)}>Edit</button>
                  <button className='btn btn-danger' onClick={() => handleDeleteEntry('employmentHistory', index)}>Delete</button>
                </div>
              </div>
              )}
            </React.Fragment>
          ))}
          <div>
            <button className="btn btn-primary" style={{alignSelf: 'flex-end'}}onClick={handleAddEmploymentHistory}>Add</button>
          </div>
        </div>

        <div style={{ background: 'white', padding: '10px', borderRadius: '10px', position: 'relative' }}>
          <strong>Skills:</strong>
          {profile.skills && profile.skills.map((item, index) => (
            <React.Fragment key={index}>
            {index !== 0 && (
            <div key={index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px', position: 'relative', paddingRight: '100px' }}>
              {editMode && editedField === 'skills' && editedIndex === index ? (
                <div>
                  <textarea style={{textAlign: 'left', minHeight: '200px', minWidth: '900px'}} value={editedValue} onChange={(e) => setEditedValue(e.target.value)} />
                  <button style={{ marginRight: '5px' }} className='btn btn-primary' onClick={handleSave}>Save</button>
                  <button style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '30px' }}className='btn btn-danger' onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <div style={{ width: 'calc(100% - 120px)', whiteSpace: 'pre-wrap' }}> {/* Adjusted width */}
                      {item.replace(/<br>/g, '\n')}
                    </div>
              )}
              <div style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
                <button style={{ marginRight: '5px' }} className='btn btn-secondary' onClick={() => handleEdit('skills', item, index)}>Edit</button>
                <button className='btn btn-danger' onClick={() => handleDeleteEntry('skills', index)}>Delete</button>
              </div>
            </div>
            )}
            </React.Fragment>
          ))}
          <div style={{alignSelf: 'flex-end'}}>
            <button className="btn btn-primary" onClick={handleAddSkill}>Add</button>
          </div>
        </div>

        </div>
      </div>

      {showAddAcademicHistory && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'lavender', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <label>Put academic history here:</label>
          <input value={newAcademicHistory} onChange={(e) => setNewAcademicHistory(e.target.value)} />
          <button className="btn btn-primary" style={{marginRight: '5px'}} onClick={handleSaveNewAcademicHistory}>Save</button>
          <button className='btn btn-danger' onClick={handleCancelAddAcademicHistory}>Cancel</button>
        </div>
      )}

      {showAddEmploymentHistory && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'lavender', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <label>Describe your employment entry. Suggested Format: (Title. Employer. Job Duties. Reason For Leaving.)</label>
          <input value={newEmploymentHistory} onChange={(e) => setNewEmploymentHistory(e.target.value)} />
          <button className="btn btn-primary" style={{marginRight: '5px'}} onClick={handleSaveNewEmploymentHistory}>Save</button>
          <button className='btn btn-danger' onClick={handleCancelAddEmploymentHistory}>Cancel</button>
        </div>
      )}

      {showAddSkills && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'lavender', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
          <label>Describe the skill you wish to add:</label>
          <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}/>
          <button className='btn btn-primary' style={{marginRight: '5px'}} onClick={handleSaveNewSkill}>Save</button>
          <button className='btn btn-danger' onClick={handleCancelAddSkill}>Cancel</button>
        </div>
      )}
        <div className="d-flex justify-content-center mt-4 mb-5">
    <button type="button" className="btn btn-danger mx-2" onClick={handleDeleteAccount}>
      Delete Account
    </button>
    <button type="button" className="btn btn-danger mx-2" onClick={handleResetPassword}>
      Reset Password
    </button>
  </div>
    </>

    
  );
};

export default Profile;