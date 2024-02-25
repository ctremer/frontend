import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const navbar = [
  { title: "Dashboard", url: "admin-dashboard" },
  { title: "Manage Jobs", url: "job" },
  { title: "Manage Scholarships", url: "scholarship" },
  { title: "Users", url: "users" },
];

export default function Scholarship() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editScholarshipData, setEditScholarshipData] = useState(null);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingScholarship, setDeletingScholarship] = useState(null);

  const [showTitleError, setShowTitleError] = useState(false);
  const [showOpenDateError, setShowOpenDateError] = useState(false);
  const [showDeadlineError, setShowDeadlineError] = useState(false);
  const [showAmtPerAwardError, setShowAmtPerAwardError] = useState(false);
  const [showAwardsAvailError, setShowAwardsAvailError] = useState(false);

  const initialTitle = editScholarshipData ? editScholarshipData.title : "";
  const initialOpenDate = editScholarshipData ? editScholarshipData.openDate : null;
  const initialDeadline = editScholarshipData ? editScholarshipData.deadline : null;
  const initialLocation = editScholarshipData ? editScholarshipData.location : "";
  const initialDescription = editScholarshipData ? editScholarshipData.description : "";
  const initialAmtPerAward = editScholarshipData ? editScholarshipData.amtPerAward : null;
  const initialAwardsAvail = editScholarshipData ? editScholarshipData.awardsAvail : null;
  const initialQualifications = editScholarshipData ? editScholarshipData.qualifications : "";

  const [title, setTitle] = useState(initialTitle);
  const [openDate, setOpenDate] = useState(initialOpenDate);
  const [deadline, setDeadline] = useState(initialDeadline);
  const [location, setLocation] = useState(initialLocation);
  const [description, setDescription] = useState(initialDescription);
  const [amtPerAward, setAmtPerAward] = useState(initialAmtPerAward);
  const [awardsAvail, setAwardsAvail] = useState(initialAwardsAvail);
  const [qualifications, setQualifications] = useState(initialQualifications);

  const [scholarships, setScholarships] = useState();
  const [reload, setReload] = useState(false);

  const [isAmtPerAwardValid, setIsAmtPerAwardValid] = useState(false);
  const [isAwardsAvailValid, setIsAwardsAvailValid] = useState(false);

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

    // Check if AmtPerAward is valid (MAYBE NEEDS TO BE NULL?)
    const amtPerAwardValid = amtPerAward === null || (!isNaN(parseFloat(amtPerAward)) && isFinite(amtPerAward));
    setIsAmtPerAwardValid(amtPerAwardValid);

    // Check if AwardsAvail is valid
    const awardsAvailValid = awardsAvail === '' || (!isNaN(parseFloat(awardsAvail)) && isFinite(awardsAvail));
    setIsAwardsAvailValid(awardsAvailValid);

    if (amtPerAwardValid && awardsAvailValid) {
      const scholarshipData = {
        title,
        openDate,
        deadline,
        location,
        description,
        amtPerAward: amtPerAward === "" ? null : parseFloat(amtPerAward),
        awardsAvail: awardsAvail === "" ? null : parseFloat(awardsAvail),
        qualifications
      }

      if(editScholarshipData) {
        await axios.put(`https://nami-backend.onrender.com/api/scholarship/update/${currentEditId}`, scholarshipData);
        setCurrentEditId(null);
      } else {
        await axios.post("https://nami-backend.onrender.com/api/scholarship/create", scholarshipData);
      }
      setReload(!reload);
      setShowAddForm(false);
      setEditScholarshipData(null);

      // Clear form fields
      setTitle("");
      setOpenDate(null);
      setDeadline(null);
      setLocation("");
      setDescription("");
      setAmtPerAward(null);
      setAwardsAvail(null);
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
    setDeletingScholarship(null);
    setShowDeleteModal(false);
    
  };

  const handleAmtPerAwardChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setIsAmtPerAwardValid(true);
      setAmtPerAward(value);
      setShowAmtPerAwardError(false);
      return;
    } else {
      setAmtPerAward(null);
      e.target.value = null;
      setShowAmtPerAwardError(true);
    }
  };

  const handleAwardsAvailChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value)) {
      setIsAwardsAvailValid(true);
      setAwardsAvail(value);
      setShowAwardsAvailError(false);
      return;
    } else {
      setAwardsAvail(null);
      e.target.value = null;
      setShowAwardsAvailError(true);
    }
  };

  const handleEdit = (scholarship) => {
    setEditScholarshipData(scholarship);
    setCurrentEditId(scholarship._id);

    // Set the initial values for the form fields based on scholarship being editted
    setTitle(scholarship.title);
    setOpenDate(scholarship.openDate);
    setDeadline(scholarship.deadline);
    setLocation(scholarship.location);
    setDescription(scholarship.description);
    setAmtPerAward(scholarship.amtPerAward);
    setAwardsAvail(scholarship.awardsAvail);
    setQualifications(scholarship.qualifications);

    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditScholarshipData(null);
    // Reset all state variables
    setTitle("");
    setOpenDate(null);
    setDeadline(null);
    setLocation("");
    setDescription("");
    setAmtPerAward(null);
    setAwardsAvail(null);
    setQualifications("");

    // Clear errors
    setShowTitleError(false);
    setShowOpenDateError(false);
    setShowDeadlineError(false);
    setShowAmtPerAwardError(false);
    setShowAwardsAvailError(false);
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
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>ED OP</Link>
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
          <button type="button" className="btn btn-info" id="sidebarCollapse">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      

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
                {scholarships.map((scholarship, index) => (
                  <tr key={scholarship._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{scholarship.title}</td>
                    <td>{scholarship.openDate}</td>
                    <td>{scholarship.location}</td>
                    <td>{scholarship.amtPerAward}</td>
                    <td>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(scholarship)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleShowDeleteModal(scholarship)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No scholarships found</p>
          )}
        </div>
      ) : null}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    

      <div id="content" className="container-fluid">
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
          <div className="add-form">
            <h2 style={{ marginLeft: 400 }}> {editScholarshipData ? 'Edit Scholarship' : 'Create Scholarships ( * indicates Required Field)'}</h2>
            <div className='create-scholarship-container'>
              <form onSubmit={handleSubmit}>
                
                <label htmlFor="titleError" className="error">{showTitleError ? '* Title is required' : ''}</label>
                <label htmlFor="title" className="label">Title*</label>
                <input type="text" className="textField-small" id="title"
                 value={title} onChange={(e) => setTitle(e.target.value)} required />
              
              <label htmlFor="openDateError" className="error">{showOpenDateError ? '* Open Date is required' : ''}</label>
                <label htmlFor="openDate" className="label">Open Date*</label>
                <input 
                  type="date" 
                  className="textField-small" 
                  id="openDate"
                  value={openDate} 
                  onChange={(e) => setOpenDate(e.target.value)} 
                  required 
                  />

                <label htmlFor="deadlineError" className="error">{showDeadlineError ? '* Deadline is required' : ''}</label>
                <label htmlFor="deadline" className="label">Deadline*</label>
                <input 
                  type="date" 
                  className="textField-small" 
                  id="deadline"
                  value={deadline} 
                  onChange={(e) => setDeadline(e.target.value)} 
                  required 
                  />

                <label htmlFor="location" className="label">Location</label>
                <input type="text" className="textField-small" id="location"
                 value={location} onChange={(e) => setLocation(e.target.value)}/>

                <label htmlFor="description" className="label">Description</label>
                <input type="text" className="textField-small" id="description"
                 value={description} onChange={(e) => setDescription(e.target.value)}/>

                <label htmlFor="amtPerAwardError" className="error">{showAmtPerAwardError ? '* Award must be a number' : ''}</label>
                <label htmlFor="amtPerAward" className="label">Award</label>
                <input type="text" className="textField-small" id="amtPerAward"
                 value={amtPerAward} onChange={handleAmtPerAwardChange}/>

                <label htmlFor="awardsAvailError" className="error">{showAwardsAvailError ? '* Awards Available must be a number' : ''}</label>
                <label htmlFor="awardsAvail" className="label">Awards Available</label>
                <input type="text" className="textField-small" id="awardsAvail"
                 value={awardsAvail} onChange={handleAwardsAvailChange}/>

                <label htmlFor="qualifications" className="label">Qualifications</label>
                <input type="text" className="textField-small" id="qualifications"
                 value={qualifications} onChange={(e) => setQualifications(e.target.value)}/>

                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{editScholarshipData ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </form>
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
