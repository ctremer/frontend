import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const navbar = [
  { title: "Dashboard", url: "admin-dashboard" },
  { title: "Manage Jobs", url: "job" },
  { title: "Manage Scholarships", url: "scholarship" },
  { title: "Users", url: "users" },
];

export default function Scholarship() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editScholarshipData, setEditScholarshipData] = useState("");
  const [currentEditId, setCurrentEditId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingScholarship, setDeletingScholarship] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);
  const [showOpenDateError, setShowOpenDateError] = useState(false);
  const [showDeadlineError, setShowDeadlineError] = useState(false);
  const [showAmtPerAwardError, setShowAmtPerAwardError] = useState(false);
  const [showAwardsAvailError, setShowAwardsAvailError] = useState(false);
  const [showOpenAfterDeadlineError, setShowOpenAfterDeadlineError] = useState(false);
  const [showDeadlineBeforeOpenError, setShowDeadlineBeforeOpenError] = useState(false);

  const initialTitle = editScholarshipData ? editScholarshipData.title : "";
  const initialOpenDate = editScholarshipData ? editScholarshipData.openDate : "";
  const initialDeadline = editScholarshipData ? editScholarshipData.deadline : "";
  const initialLocation = editScholarshipData ? editScholarshipData.location : "";
  const initialDescription = editScholarshipData ? editScholarshipData.description : "";
  const initialAmtPerAward = editScholarshipData ? editScholarshipData.amtPerAward : "";
  const initialAwardsAvail = editScholarshipData ? editScholarshipData.awardsAvail : "";
  const initialQualifications = editScholarshipData ? editScholarshipData.qualifications : "";

  const [title, setTitle] = useState(initialTitle);
  const [openDate, setOpenDate] = useState(initialOpenDate);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [location, setLocation] = useState(initialLocation);
  const [description, setDescription] = useState(initialDescription);
  const [amtPerAward, setAmtPerAward] = useState(initialAmtPerAward);
  const [awardsAvail, setAwardsAvail] = useState(initialAwardsAvail);
  const [qualifications, setQualifications] = useState(initialQualifications);
  const [photo, setPhoto] = useState(null);

  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOpenDate, setFilterOpenDate] = useState('');
  const [filterDeadline, setFilterDeadline] = useState('');

  const [scholarships, setScholarships] = useState();
  const [reload, setReload] = useState(false);

  const [isAmtPerAwardValid, setIsAmtPerAwardValid] = useState(false);
  const [isAwardsAvailValid, setIsAwardsAvailValid] = useState(false);

  const navigate = useNavigate();

  const auth = localStorage.getItem('auth');

  useEffect(() => {
    if (!auth) {
      return navigate('/login');
    }
  });

  const handleFetch = async () => {
    const response = await axios("https://nami-backend.onrender.com/api/scholarship/fetch");
    setScholarships(response?.data);
  };

  

  useEffect(() => {
    setReload(false);
    handleFetch();
  }, [reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title) {
      setShowTitleError(true);
    } else {
      setShowTitleError(false);
    }

    if (!openDate) {
      setShowOpenDateError(true);
    } else {
      setShowOpenDateError(false);
    }

    if (!deadline) {
      setShowDeadlineError(true);
    } else {
      setShowDeadlineError(false);
    }


    if(!amtPerAward) {
      setShowAmtPerAwardError(true);
    } else {
      setShowAmtPerAwardError(false);
    }

    if(!awardsAvail) {
      setShowAwardsAvailError(true);
    } else {
      setShowAwardsAvailError(false);
    }

    

    // Check if AmtPerAward is valid (MAYBE NEEDS TO BE NULL?)
    const amtPerAwardValid = true
    if (amtPerAward === null || (!isNaN(parseFloat(amtPerAward)) && isFinite(amtPerAward))){
      setIsAmtPerAwardValid(amtPerAwardValid);
    }

    const awardsAvailValid = true
    if (awardsAvail === null || (!isNaN(parseFloat(awardsAvail)) && isFinite(awardsAvail))) {
      setIsAwardsAvailValid(awardsAvailValid);
    }

    // if (!awardsAvail) {
    //   setAwardsAvail(null)
    // }
    if (awardsAvail != null && awardsAvail != "" && amtPerAward != null && amtPerAward != "" && !showOpenAfterDeadlineError) {
      const scholarshipData = {
        title,
        openDate,
        deadline,
        location,
        description,
        amtPerAward: amtPerAward === "" ? null : parseFloat(amtPerAward),
        awardsAvail,
        qualifications,
        photo
      }

      scholarshipData.openDate = formatDate(scholarshipData.openDate)
      scholarshipData.deadline = formatDate(scholarshipData.deadline)
      console.log(awardsAvail)
      if(editScholarshipData) {
        await axios.put(`https://nami-backend.onrender.com/api/scholarship/update/${currentEditId}`, scholarshipData);
        setCurrentEditId(null);
      } else {
        console.log(awardsAvail)
        await axios.post("https://nami-backend.onrender.com/api/scholarship/create", scholarshipData);
      }
      setReload(!reload);
      setShowAddForm(false);
      setEditScholarshipData("");

      // Clear form fields
      setTitle("");
      setOpenDate("");
      setDeadline("");
      setLocation("");
      setDescription("");
      setAmtPerAward("");
      setAwardsAvail("");
      setQualifications("");

      // Clear errors
      setShowTitleError(false);
      setShowOpenDateError(false);
      setShowDeadlineError(false);
      setShowAmtPerAwardError(false);
      setShowAwardsAvailError(false);
    }
  };

  const handleShowDeleteModal = (scholarship) => {
    setDeletingScholarship(scholarship);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://nami-backend.onrender.com/api/scholarship/delete/${deletingScholarship._id}`);
      setReload(!reload);
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    }
    setDeletingScholarship(false);
    setShowDeleteModal(false);
    
  };

  const handleAmtPerAwardChange = (e) => {
    
    const value = e.target.value;
    if (!isNaN(value) && value != "" && !value.includes(" ")) {
      setIsAmtPerAwardValid(true);
      setAmtPerAward(value);
      setShowAmtPerAwardError(false);
      return;
    } else if (value == "") {
      setAmtPerAward(value);
      setShowAmtPerAwardError(true);
      setIsAmtPerAwardValid(false);
    } else if (value.includes(" ")) {
      setIsAmtPerAwardValid(false);
    } 
  };

  const handleAwardsAvailChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && value != "" && !value.includes(" ")) {
      setIsAwardsAvailValid(true);
      setAwardsAvail(value);
      setShowAwardsAvailError(false);
      return;
    } else if (value == "") {
      setAwardsAvail(value);
      setShowAwardsAvailError(true);
      setIsAwardsAvailValid(false);
    } else if (value.includes(" ")) {
      setIsAwardsAvailValid(false);
    } 
  };
  

  const handleOpenDateChange = (e) => {
    
    setShowOpenDateError(false)
    
    if (deadline) {
      if (e > deadline) {
        setShowOpenAfterDeadlineError(true);
      } else {
        setShowOpenAfterDeadlineError(false);
        setShowDeadlineBeforeOpenError(false);
        
      }
    }
    setOpenDate(e)
  }

  const handleDeadlineChange = (e) => {

    setShowDeadlineError(false)

    if (openDate) {
      if (e < openDate) {
        setShowDeadlineBeforeOpenError(true);
      } else {
        setShowOpenAfterDeadlineError(false);
        setShowDeadlineBeforeOpenError(false);
        
      }
    } 
    setDeadline(e)
  }

  const formatDate = (date) => {
    const parts = date.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Months are zero-based in JavaScript
    const day = parseInt(parts[2]);

    // Create a new Date object using the parsed values
    const newDate = new Date(year, month, day);

    // Format the date as "yyyy-MM-dd"
    const formattedDate = newDate.toISOString().split('T')[0];
    return formattedDate;
};

  const handleEdit = (scholarship) => {
    setEditScholarshipData(scholarship);
    setCurrentEditId(scholarship._id);

    // Set the initial values for the form fields based on scholarship being editted
    setTitle(scholarship.title);
    setOpenDate(formatDate(scholarship.openDate));
    setDeadline(formatDate(scholarship.deadline));
    setLocation(scholarship.location);
    setDescription(scholarship.description);
    setAmtPerAward(scholarship.amtPerAward);
    setAwardsAvail(scholarship.awardsAvail);
    setQualifications(scholarship.qualifications);

    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditScholarshipData("");
    // Reset all state variables
    setTitle("");
    setOpenDate("");
    setDeadline("");
    setLocation("");
    setDescription("");
    setAmtPerAward("");
    setAwardsAvail("");
    setQualifications("");

    // Clear errors
    setShowTitleError(false);
    setShowOpenDateError(false);
    setShowDeadlineError(false);
    setShowAmtPerAwardError(false);
    setShowAwardsAvailError(false);
    setShowDeadlineBeforeOpenError(false);
    setShowOpenAfterDeadlineError(false);
  };

  useEffect(() => {
    if (scholarships) {
      filterScholarships(searchInput, filterOpenDate, filterDeadline);
    }
  }, [searchInput, scholarships, filterOpenDate, filterDeadline]);

  
  const filterScholarships = (input, openDate, deadline) => {
    const filtered = scholarships.filter((scholarship) => {
      const titleMatch = scholarship.title.toLowerCase().includes(input.toLowerCase());
      const descriptionMatch = scholarship.description.toLowerCase().includes(input.toLowerCase());
      const qualificationsMatch = scholarship.qualifications.toLowerCase().includes(input.toLowerCase());
      const isOpenDatePassed = !openDate || new Date(scholarship.openDate) > new Date(openDate);
      const isDeadlinePassed = !deadline || new Date(scholarship.deadline) < new Date(deadline);
      return (titleMatch || descriptionMatch || qualificationsMatch) && isOpenDatePassed && isDeadlinePassed;
    });
    setFilteredScholarships(filtered);
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleOpenDateFilterChange = (e) => {
    setFilterOpenDate(e.target.value);
  };

  const handleDeadlineFilterChange = (e) => {
    setFilterDeadline(e.target.value);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilterOpenDate('');
    setFilterDeadline('');
    setFilterOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
  }

  const updatePhoto = (event) => {
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
        Bucket: 'nami-ed-op-scholarship-photos',
        Key: file.name,
        Body: file,
        ContentType: file.type
      };
      const data = await s3.send(new PutObjectCommand(params));
      console.log(data);
    } catch (error) {
      console.error("Error uploading photo to S3", error);
    }
    setPhoto('https://nami-ed-op-scholarship-photos.s3.us-east-2.amazonaws.com/' + file.name);
  };

  return (
    <div>
      <div className="bg-dark text-white">
        <div
          id="navbar"
          style={{
            display: "flex",
            paddingBlock: ".5em",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ marginInline: '1em', color: 'white', textDecoration: 'none' }}>
              <Link to="/admin-dashboard" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
            </h2>
            <ul
              className="list-unstyled"
              style={{
                display: "flex",
                flexDirection: "row",
                listStyle: "none",
                margin: 0,
              }}
            >
              {navbar?.map((item) => (
                <li key={item.url} style={{ marginInline: "1em" }}>
                  <Link to={`/${item?.url}`} style={{ color: "white", textDecoration: "none" }}>
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link to = '/'>
          <button type='button' className='btn btn-danger' id='sidebarCollapse' onClick={handleLogout}>
            Logout
          </button>
          </Link>
        </div>
      </div>

      <div className="col-md-8 offset-md-2" style={{marginTop: "10px"}}>
        <div className="input-group">
          <input
            type="text"
            id="searchInput"
            className="form-control"
            placeholder="Search by Title, Description, or Qualifications"
            value={searchInput}
            onChange={handleInputChange}
          />
          <div className="input-group-append" >
            <button className="btn btn-outline-secondary" style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "lavender" }} type="button" onClick={handleFilterToggle}>
              Filter
            </button>
            <button className="btn btn-outline-secondary" type="button" style={{ marginLeft: '5px', marginRight: '5px', backgroundColor: "lavender" }} onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="row mt-4">
          <div className="col-md-6 offset-md-3">
            <label htmlFor="openDateFilter">Filter by Open Date: (Shows scholarships that open after the date selected) </label>
            <input
              type="date"
              id="openDateFilter"
              className="form-control"
              value={filterOpenDate}
              style = {{ marginTop: "-50px"}}
              onChange={handleOpenDateFilterChange}
            />
            <label htmlFor="deadlineFilter">Filter by Deadline: (Shows scholarships whose deadlines are before the date selected) </label>
            <input
              type="date"
              id="deadlineFilter"
              className="form-control"
              value={filterDeadline}
              style = {{ marginTop: "-50px"}}
              onChange={handleDeadlineFilterChange}
            />
          </div>
        </div>
      )}

      

      {!showAddForm ? (
        <div id='scholarships' className='container ml-5 p-3'>
          <h2>Current Scholarships</h2>
          {scholarships && scholarships.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Open Date</th>
                  <th scope="col">Location</th>
                  <th scope="col">Award</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredScholarships.map((scholarship, index) => (
                  <tr key={scholarship._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{scholarship.title}</td>
                    <td>{formatDate(scholarship.openDate)}</td>
                    <td>{scholarship.location}</td>
                    <td>{scholarship.amtPerAward}</td>
                    <td>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(scholarship)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleShowDeleteModal(scholarship)}>Delete</button>
                      <Link to='/scholarship-details' state={{id: scholarship._id, isAdmin: true}} className="btn btn-success mr-2">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No scholarships found</p>
          )}
        </div>
      ) : ""}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    

      <div id="content" className='container ml-5 p-3'>
      <div className="d-flex justify-content-end mt-5">
          <button
            type="button"
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            {showAddForm ? "" : "Add New Scholarship"}
          </button>
      </div>

      {showAddForm && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="add-form">
            <h2 className='d-flex justify-content-center'> {editScholarshipData ? 'Edit Scholarship' : 'Create Scholarships ( * indicates Required Field)'}</h2>
            <div className='d-flex justify-content-center' style={{display: 'flex', justifyContent: 'space-between'}}>
              <form onSubmit={handleSubmit} style={{marginLeft: "400px"}}>
                
                <div className="form-group row">
                  <label htmlFor="titleError" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showTitleError ? '* Title is required' : ''}</label>
                  <label htmlFor="title" className="label" style={{marginBottom: "0px"}} >Title*</label>
                  <input type="text" className="textField-small" id="title" style={{backgroundColor: "white",maxWidth:"400px"}}
                  value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                
              
                <div className="form-group row">
                <label htmlFor="openAfterDeadline" style={{width: "300px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showOpenAfterDeadlineError ? '* Open Date must be before deadline' : ''}</label>
                <label htmlFor="openDateError" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showOpenDateError ? '* Open Date is required' : ''}</label>
                  <label htmlFor="openDate" className="label" style={{marginBottom: "0px"}}>Open Date*</label>
                  <input 
                    type="date" 
                    style={{backgroundColor: "white",maxWidth:"400px"}}
                    className="textField-small" 
                    id="openDate"
                    value={openDate} 
                    onChange={(e) => handleOpenDateChange(formatDate(e.target.value))} 
                    required 
                    onKeyDown={(e) => e.preventDefault()}
                    />
                </div>
              

                <div className="form-group row">
                <label htmlFor="deadlineBeforeOpen" style={{width: "300px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showDeadlineBeforeOpenError ? '* Deadline must be after Open Date' : ''}</label>
                  <label htmlFor="deadlineError" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showDeadlineError ? '* Deadline is required' : ''}</label>
                  <label htmlFor="deadline" className="label" style={{marginBottom: "0px"}}>Deadline*</label>
                  <input 
                    type="date" 
                    className="textField-small" 
                    id="deadline"
                    style={{marginBottom: "-30px", backgroundColor: "white",maxWidth: "400px"}}
                    value={deadline} 
                    onChange={(e) => handleDeadlineChange(formatDate(e.target.value))} 
                    required
                    onKeyDown={(e) => e.preventDefault()}
                    />
                </div>
                

                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="location" className="label" style={{marginBottom: "0px"}}>Location</label>
                  <input type="text" className="textField-small" id="location" style={{backgroundColor: "white", maxWidth: "400px"}}
                  value={location} onChange={(e) => setLocation(e.target.value)}/>
                </div>
                

                <div className="form-group row" style={{maxWidth:'400px'}}>
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="description" className="label" style={{marginBottom: "0px", marginTop: "-30px"}}>Description</label>
                  <textarea type="text" className="textField-small" id="description" style={{height: "150px",backgroundColor: "white",maxWidth:"400px"}}
                  value={description} onChange={(e) => setDescription(e.target.value)}/>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </div>
                

                <div className="form-group row">
                  <label htmlFor="amtPerAwardError" style={{width: "300px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showAmtPerAwardError ? '* Award must be a number' : ''}</label>
                  <label htmlFor="amtPerAward" className="label" style={{marginBottom: "0px"}}>Award*</label>
                  <input type="text" className="textField-small" id="amtPerAward" style={{backgroundColor: "white",maxWidth:"400px"}}
                  value={amtPerAward} onChange={handleAmtPerAwardChange} required/>
                </div>
                

                <div className="form-group row">
                  <label htmlFor="awardsAvailError" style={{ width: "300px", color: "red", marginBottom: "0px", marginTop: "10px"}} className="error">{showAwardsAvailError ? '* Awards Available must be a number' : ''}</label>
                  <label htmlFor="awardsAvail" className="label" style={{marginBottom: "0px"}}>Awards Available*</label>
                  <input type="text" className="textField-small" id="awardsAvail" style={{backgroundColor: "white",maxWidth: "400px"}}
                  value = {awardsAvail}
                  onChange={handleAwardsAvailChange} required/>
                </div>
                

                <div className="form-group row" style={{alignSelf:"center", maxWidth:'400px'}}>
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="qualifications" className="label" style={{marginTop: "-30px", marginBottom: "0px"}}>Qualifications</label>
                  <textarea type="text" className="textField-large" id="qualifications" style={{justifyContent: "left", height: "150px", backgroundColor: "white",marginBottom: "10px", maxWidth: "400px"}}
                  value={qualifications} onChange={(e) => setQualifications(e.target.value)}/>
                  <ReactMarkdown>{qualifications}</ReactMarkdown>
                </div>
                
                <div className="form-group row">
                  <label className="label" style={{marginBottom:"0px"}}>Upload photo</label>
                  <input type="file" onChange={updatePhoto} accept=".png" />
                </div>
                <button type="submit" className="btn btn-primary" style={{alignSelf: "flex-end", marginRight: "5px"}} onClick={handleSubmit}>{editScholarshipData ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </form>
            </div>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onCancel}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            Are you sure you want to delete this item?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>No</button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
};
