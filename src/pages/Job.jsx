import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const navbar = [
  { title: "Dashboard", url: "admin-dashboard" },
  { title: "Manage Jobs", url: "job" },
  { title: "Manage Scholarships", url: "scholarship" },
  { title: "Users", url: "users" },
];

export default function Job() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editJobData, setEditJobData] = useState(null);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingJob, setDeletingJob] = useState(null);

  const [showTitleError, setShowTitleError] = useState(false);
  const [showTypeError, setShowTypeError] = useState(false);
  const [showDescriptionError, setShowDescriptionError] = useState(false);
  const [showEmployerError, setShowEmployerError] = useState(false);
  const [showSalaryError, setShowSalaryError] = useState(false);
  const [showHourlyPayError, setShowHourlyPayError] = useState(false);
  const [showWeeklyHoursError, setShowWeeklyHoursError] = useState(false);
  const [showScheduleError, setShowScheduleError] = useState(false);
  const [showReqQualError, setShowReqQualError] = useState(false);
  const [showRemoteError, setShowRemoteError] = useState(false);

  const initialTitle = editJobData ? editJobData.title : "";
  const initialType = editJobData ? editJobData.type : "";
  const initialDescription = editJobData ? editJobData.description : "";
  const initialEmployer = editJobData ? editJobData.employer : "";
  const initialPayType = editJobData ? editJobData.payType : null;
  const initialSalary = editJobData ? editJobData.salary : null;
  const initialHourlyPay = editJobData ? editJobData.hourlyPay : null;
  const initialSchedule = editJobData ? editJobData.schedule : "";
  const initialWeeklyHours = editJobData ? editJobData.weeklyHours : null;
  const initialReqQuals = editJobData ? editJobData.reqQual : "";
  const initialPrefQuals = editJobData ? editJobData.prefQual : "";
  const initialLocation = editJobData ? editJobData.location : "";
  const initialRemote = editJobData ? editJobData.remote : "";
  const initialBenefits = editJobData ? editJobData.benefits : "";

  const [title, setTitle] = useState(initialTitle);
  const [type, setType] = useState(initialType);
  const [description, setDescription] = useState(initialDescription);
  const [employer, setEmployer] = useState(initialEmployer);
  const [payType, setPayType] = useState(initialPayType);
  const [salary, setSalary] = useState(initialSalary);
  const [hourlyPay, setHourlyPay] = useState(initialHourlyPay);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [weeklyHours, setWeeklyHours] = useState(initialWeeklyHours);
  const [reqQual, setReqQual] = useState(initialReqQuals);
  const [prefQual, setPrefQual] = useState(initialPrefQuals);
  const [location, setLocation] = useState(initialLocation);
  const [remote, setRemote] = useState(initialRemote);
  const [benefits, setBenefits] = useState(initialBenefits);

  const [jobs, setJobs] = useState([]);
  const [reload, setReload] = useState(false);

  const[isSalaryValid, setIsSalaryValid] = useState(false);
  const[isHourlyPayValid, setIsHourlyPayValid] = useState(false);
  const[isWeeklyHoursValid, setIsWeeklyHoursValid] = useState(false);

  const handleFetch = async () => {
    const response = await axios.get("https://nami-backend.onrender.com/api/job/fetch");
    setJobs(response.data);
  };

  useEffect(() => {
    handleFetch();
  }, [reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if required fields are empty
    if (!title) {
      setShowTitleError(true);
    } else {
      setShowTitleError(false);
    }

    if (!type) {
      setShowTypeError(true);
    } else {
      setShowTypeError(false);
    }

    if (!description) {
      setShowDescriptionError(true);
    } else {
      setShowDescriptionError(false);
    }

    if (!employer) {
      setShowEmployerError(true);
    } else {
      setShowEmployerError(false);
    }

    if (!schedule) {
      setShowScheduleError(true);
    } else {
      setShowScheduleError(false);
    }

    if (!remote) {
      setShowRemoteError(true);
    } else {
      setShowRemoteError(false);
    }

    if (!reqQual) {
      setShowReqQualError(true);
    } else {
      setShowReqQualError(false);
    }


  
    // Check if salary is valid
    const salaryValid = salary === '' || (!isNaN(parseFloat(salary)) && isFinite(salary));
    setIsSalaryValid(salaryValid);
  
    // Check if hourlyPay is valid
    const hourlyPayValid = hourlyPay === '' || (!isNaN(parseFloat(hourlyPay)) && isFinite(hourlyPay));
    setIsHourlyPayValid(hourlyPayValid);
  
    // Check if weeklyHours is valid
    const weeklyHoursValid = weeklyHours === '' || (!isNaN(parseFloat(weeklyHours)) && isFinite(weeklyHours));
    setIsWeeklyHoursValid(weeklyHoursValid);
  
    if (salaryValid && hourlyPayValid && weeklyHoursValid) {
      const jobData = {
        title,
        type,
        description,
        employer,
        payType: payType === "" ? null : payType, // Convert empty string to null
        salary: salary === "" ? null : parseFloat(salary), // Convert empty string to null or parse as float
        hourlyPay: hourlyPay === "" ? null : parseFloat(hourlyPay), // Convert empty string to null or parse as float
        schedule,
        weeklyHours: weeklyHours === "" ? null : parseFloat(weeklyHours), // Convert empty string to null or parse as float
        reqQual,
        prefQual,
        location,
        remote,
        benefits,
      };

      // BUG: Number type fields set null - Can't set a previously filled number value to nothing
      if(editJobData) {
        await axios.put(`https://nami-backend.onrender.com/api/job/update/${currentEditId}`, jobData);
        setCurrentEditId(null);
      } else {
        await axios.post("https://nami-backend.onrender.com/api/job/create", jobData);
      }
      setReload(!reload);
      setShowAddForm(false); // Close the form after submitting

      // Clear the form fields
      setTitle("");
      setType("");
      setDescription("");
      setEmployer("");
      setPayType("");
      setSalary(null);
      setHourlyPay(null);
      setSchedule("");
      setWeeklyHours(null);
      setReqQual("");
      setPrefQual("");
      setLocation("");
      setRemote("");
      setBenefits("");
    } // Ending bracket of if - Only submit if all fields are valid data types
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;

    // If the input is empty, clear the salary state
    if (!isNaN(value)) {
      setIsSalaryValid(true); // Reset validation state
      setSalary(value); // Clear the salary state
      setShowSalaryError(false);
      return;
    } else {
      setSalary(null);
      e.target.value = null;
      setShowSalaryError(true);
    }
  };

  const handleHourlyPayChange = (e) => {
    const value = e.target.value;

    // If the input is empty, clear the hourly state
    if (!isNaN(value)) {
      setIsHourlyPayValid(true); // Reset validation state
      setHourlyPay(value); // Clear the hourly state
      setShowHourlyPayError(false);
      return;
    } else {
      setHourlyPay(null);
      e.target.value = null;
      setShowHourlyPayError(true);
    }
  };

  const handleWeeklyHoursChange = (e) => {
    const value = e.target.value;

    // If the input is empty, clear the weeklyHours state
    if (!isNaN(value)) {
      setIsWeeklyHoursValid(true); // Reset validation state
      setWeeklyHours(value); // Clear the weeklyHours state
      setShowWeeklyHoursError(false);
      return;
    } else {
      setWeeklyHours(null);
      e.target.value = null;
      setShowWeeklyHoursError(true);
    }
  };

  const handleEdit = (job) => {
    setEditJobData(job);
    setCurrentEditId(job._id);

    // Set the initial values for the form fields based on the job being edited
    setTitle(job.title);
    setType(job.type);
    setDescription(job.description);
    setEmployer(job.employer);
    setPayType(job.payType);
    setSalary(job.salary);
    setHourlyPay(job.hourlyPay);
    setSchedule(job.schedule);
    setWeeklyHours(job.weeklyHours);
    setReqQual(job.reqQual);
    setPrefQual(job.prefQual);
    setLocation(job.location);
    setRemote(job.remote);
    setBenefits(job.benefits);

    setShowAddForm(true);
  };

  const handleShowDeleteModal = (job) => {
    setDeletingJob(job);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://nami-backend.onrender.com/api/job/delete/${deletingJob._id}`);
      setReload(!reload);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
    setDeletingJob(null);
    setShowDeleteModal(false);
    
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditJobData(null);
    // Reset all state variables to empty strings
    setTitle("");
    setType("");
    setDescription("");
    setEmployer("");
    setPayType("");
    setSalary("");
    setHourlyPay("");
    setSchedule("");
    setWeeklyHours("");
    setReqQual("");
    setPrefQual("");
    setLocation("");
    setRemote("");
    setBenefits("");
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
        <div id='jobs' className='container ml-5 p-3'>
          <h2>Current Jobs</h2>
          {jobs && jobs.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Salary</th>
                  <th scope="col">Location</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr key={job._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{job.title}</td>
                    <td>{job.salary}</td>
                    <td>{job.location}</td>
                    <td>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleShowDeleteModal(job)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No jobs found</p>
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
            {showAddForm ? "" : "Add New Job"}
          </button>
        </div>

        {showAddForm && (
          <div className="add-form">
            <h2 style={{ marginLeft: 400 }}> {editJobData ? 'Edit Job' : 'Create Jobs ( * indicates Required Field)'}</h2>
            <div className='create-job-container'>
              <form onSubmit={handleSubmit}>
                
                <label htmlFor="titleError" className="error">{showTitleError ? '* Title is required' : ''}</label>
                <label htmlFor="title" className="label">Title*</label>
                <input type="text" className="textField-small" id="title"
                 value={title} onChange={(e) => setTitle(e.target.value)} required />
              
                <label htmlFor="typeError" className="error">{showTypeError ? '* Job Type is required' : ''}</label>
                <label htmlFor="type" className="label">Job Type*</label>
                <input type="text" className="textField-small" id="type"
                 value={type} onChange={(e) => setType(e.target.value)} required />
              
                <label htmlFor="descriptionError" className="error">{showDescriptionError ? '* Description is required' : ''}</label>
                <label htmlFor="description" className="label">Description*</label>
                <textarea type="text" className="textField-large" id="description"
                 value={description} onChange={(e) => setDescription(e.target.value)} required />

                <label htmlFor="employerError" className="error">{showEmployerError ? '* Employer is required' : ''}</label>
                <label htmlFor="employer" className="label">Employer*</label>
                <input type="text" className="textField-small" id="employer"
                 value={employer} onChange={(e) => setEmployer(e.target.value)} required />
              
                <label htmlFor="payType" className="label">Pay Type</label>
                <input type="text" className="textField-small" id="payType"
                 value={payType} onChange={(e) => setPayType(e.target.value)}/>

                <label htmlFor="salaryError" className="error">{showSalaryError ? '* Salary must be a number' : ''}</label>
                <label htmlFor="salary" className="label">Yearly Salary (USD)</label>
                <input type="text" className={`textField-small ${!isSalaryValid}`} id="salary"
                 value={salary} onChange={handleSalaryChange} />

                <label htmlFor="hourlyPayError" className="error">{showHourlyPayError ? '* Hourly Pay must be a number' : ''}</label>
                <label htmlFor="hourlyPay" className="label">Hourly Pay (USD)</label>
                <input type="text" className={`textField-small ${!isHourlyPayValid}`} id="hourlyPay"
                 value={hourlyPay} onChange={handleHourlyPayChange}/>

                <label htmlFor="scheduleError" className="error">{showScheduleError ? '* Schedule is required' : ''}</label>
                <label htmlFor="schedule" className="label">Schedule*</label>
                <input type="text" className="textField-small" id="schedule"
                 value={schedule} onChange={(e) => setSchedule(e.target.value)} required />

                <label htmlFor="weeklyHoursError" className="error">{showWeeklyHoursError ? '* Weekly Hours must be a number' : ''}</label>
                <label htmlFor="weeklyHours" className="label">Weekly Hours*</label>
                <input type="text" className={`textField-small ${!isWeeklyHoursValid}`} id="weeklyHours"
                 value={weeklyHours} onChange={handleWeeklyHoursChange} required />
                
                <label htmlFor="reqQualError" className="error">{showReqQualError ? '* Required Qualifications is required' : ''}</label>
                <label htmlFor="reqQual" className="label">Required Qualifications*</label>
                <textarea type="text" className="textField-large" id="reqQual"
                 value={reqQual} onChange={(e) => setReqQual(e.target.value)} required />

                <label htmlFor="prefQual" className="label">Preferred Qualifications</label>
                <textarea type="text" className="textField-large" id="prefQual"
                 value={prefQual} onChange={(e) => setPrefQual(e.target.value)}/>

                <label htmlFor="location" className="label">Location</label>
                <input type="text" className="textField-small" id="location"
                 value={location} onChange={(e) => setLocation(e.target.value)}/>

                <label htmlFor="remoteError" className="error">{showRemoteError ? '* Remote is required' : ''}</label>
                <label htmlFor="remote" className="label">Remote*</label>
                <input type="text" className="textField-small" id="remote"
                 value={remote} onChange={(e) => setRemote(e.target.value)} required />

                <label htmlFor="benefits" className="label">Benefits</label>
                <input type="text" className="textField-small" id="benefits"
                 value={benefits} onChange={(e) => setBenefits(e.target.value)}/>

                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>{editJobData ? 'Update' : 'Create'}</button>
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