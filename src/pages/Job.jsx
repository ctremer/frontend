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
  const [editJobData, setEditJobData] = useState("");
  const [currentEditId, setCurrentEditId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingJob, setDeletingJob] = useState("");

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

  const [placeHolder] = useState(false);

  const initialTitle = editJobData ? editJobData.title : "";
  const initialType = editJobData ? editJobData.type : "";
  const initialDescription = editJobData ? editJobData.description : "";
  const initialEmployer = editJobData ? editJobData.employer : "";
  const initialPayType = editJobData ? editJobData.payType : "";
  const initialSalary = editJobData ? editJobData.salary : "";
  const initialHourlyPay = editJobData ? editJobData.hourlyPay : "";
  const initialSchedule = editJobData ? editJobData.schedule : "";
  const initialWeeklyHours = editJobData ? editJobData.weeklyHours : "";
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

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJobTypeFilter, setSelectedJobTypeFilter] = useState('');
  const [selectedPayTypeFilter, setSelectedPayTypeFilter] = useState('');
  const [selectedRemoteFilter, setSelectedRemoteFilter] = useState('');

  const [jobs, setJobs] = useState([]);
  const [reload, setReload] = useState(false);

  const[isSalaryValid, setIsSalaryValid] = useState(false);
  const[isHourlyPayValid, setIsHourlyPayValid] = useState(false);
  const[isWeeklyHoursValid, setIsWeeklyHoursValid] = useState(false);

  const[readyToSubmit, setReadyToSubmit] = useState(true);

  const handleFetch = async () => {
    const response = await axios.get("https://nami-backend.onrender.com/api/job/fetch");
    setJobs(response.data);
  };

  useEffect(() => {
    handleFetch();
  }, [reload]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isReady = true; // Assume the form is ready to submit

    // Check if required fields are empty
    if (!title) {
      setShowTitleError(true);
      isReady = false; // If title is empty, form is not ready
    } else {
        setShowTitleError(false);
    }

    if (!type) {
        setShowTypeError(true);
        isReady = false;
    } else {
        setShowTypeError(false);
    }

    if (!description) {
        setShowDescriptionError(true);
        isReady = false;
    } else {
        setShowDescriptionError(false);
    }

    if (!employer) {
        setShowEmployerError(true);
        isReady = false;
    } else {
        setShowEmployerError(false);
    }

    if (!schedule) {
        setShowScheduleError(true);
        isReady = false;
    } else {
        setShowScheduleError(false);
    }

    if (!remote) {
        setShowRemoteError(true);
        isReady = false;
    } else {
        setShowRemoteError(false);
    }

    if (!reqQual) {
        setShowReqQualError(true);
        isReady = false;
    } else {
        setShowReqQualError(false);
    }

    if (!weeklyHours) {
        setShowWeeklyHoursError(true);
        isReady = false;
    } else {
        setShowWeeklyHoursError(false);
    }

   
    // Add similar checks for other required fields

    // Check if salary is valid
    const salaryValid = salary === '' || (!isNaN(parseFloat(salary)) && isFinite(salary));
    setIsSalaryValid(salaryValid);

    // Check if hourlyPay is valid
    const hourlyPayValid = hourlyPay === '' || (!isNaN(parseFloat(hourlyPay)) && isFinite(hourlyPay));
    setIsHourlyPayValid(hourlyPayValid);

    // Check if weeklyHours is valid
    const weeklyHoursValid = weeklyHours === '' || (!isNaN(parseFloat(weeklyHours)) && isFinite(weeklyHours));
    setIsWeeklyHoursValid(weeklyHoursValid);

    // Set readyToSubmit based on all conditions
    const readyToSubmit = isReady && salaryValid && hourlyPayValid && weeklyHoursValid;

    if (readyToSubmit) {
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

        // Handle form submission
        if (editJobData) {
          if (jobData.salary == 0) {
            jobData.salary = " "
          }

          if (jobData.hourlyPay == 0) {
            jobData.hourlyPay = " "
          }
          console.log(jobData)
          console.log("updating")
            await axios.put(`https://nami-backend.onrender.com/api/job/update/${currentEditId}`, jobData);
            setCurrentEditId(null);
            setEditJobData("")
        } else {
            await axios.post("https://nami-backend.onrender.com/api/job/create", jobData);
        }

        // Clear the form fields
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

        setShowAddForm(false);

        setReload(!reload);
    }
  };

  const handleSalaryChange = (e) => {
    const value = e.target.value;

    
    if (!isNaN(value) && value != "" && !value.includes(" ")) {
      let temp = parseInt(value, 10);
      console.log(temp)
      setIsSalaryValid(true);
      setSalary(temp);
      setShowSalaryError(false);
      return;
    } else if (value == "") {
      setSalary(0);
      
      setIsSalaryValid(false);
    } else {
      setIsSalaryValid(false);
      setShowSalaryError(true);
    } 
  };

  const handleHourlyPayChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && value != "" && !value.includes(" ")) {
      console.log("replacing")
      let temp = parseInt(value, 10);
      console.log(temp)
      setIsHourlyPayValid(true);
      setHourlyPay(temp);
      setShowHourlyPayError(false);
      return;
    } else if (value == "") {
      setHourlyPay(0);
      setIsHourlyPayValid(true);
    } else {
      setIsHourlyPayValid(false);
      setShowHourlyPayError(true);
    } 

    // If the input is empty, clear the hourly state
    // if (!isNaN(value)) {
    //   setIsHourlyPayValid(true); // Reset validation state
    //   setHourlyPay(value); // Clear the hourly state
    //   setShowHourlyPayError(false);
    //   return;
    // } else {
    //   setHourlyPay("");
    //   e.target.value = "";
    //   setShowHourlyPayError(true);
    // }
  };

  const handleWeeklyHoursChange = (e) => {
    const value = e.target.value;

    if (!isNaN(value) && value != "" && !value.includes(" ")) {
      setIsWeeklyHoursValid(true);
      setWeeklyHours(value);
      setShowWeeklyHoursError(false);
      return;
    } else if (value == "") {
      setWeeklyHours(value);
      setShowWeeklyHoursError(true);
      setIsWeeklyHoursValid(false);
    } else if (value.includes(" ")) {
      setIsWeeklyHoursValid(false);
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
    setDeletingJob("");
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

    toggleErrors(false);
  };

  useEffect(() => {
    filterJobs(searchInput);
  }, [jobs, searchInput, selectedJobTypeFilter, selectedPayTypeFilter, selectedRemoteFilter]);

  const filterJobs = (input) => {
    const filtered = jobs.filter((job) => {
      const titleMatch = job.title.toLowerCase().includes(input.toLowerCase());
      const descriptionMatch = job.description.toLowerCase().includes(input.toLowerCase());
      const payTypeMatch = !selectedPayTypeFilter || job.payType.toLowerCase() === selectedPayTypeFilter.toLowerCase();
      const qualMatch = job.reqQual.toLowerCase().includes(input.toLowerCase()) || job.prefQual.toLowerCase().includes(input.toLowerCase());
      const typeMatch = !selectedJobTypeFilter || job.type.toLowerCase() === selectedJobTypeFilter.toLowerCase();
      const remoteMatch = !selectedRemoteFilter || job.remote.toLowerCase() === selectedRemoteFilter.toLowerCase();
  
      return (!input || titleMatch || descriptionMatch || qualMatch) &&
             (!selectedPayTypeFilter || payTypeMatch) &&
             (!selectedJobTypeFilter || typeMatch) &&
             (!selectedRemoteFilter || remoteMatch);
    });
  
    setFilteredJobs(filtered);
  };
  
  
  
  

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleJobTypeFilterChange = (jobType) => {
    setSelectedJobTypeFilter(jobType); // Set the selected filter
  };

  const handlePayTypeFilterChange = (payType) => {
    setSelectedPayTypeFilter(payType); // Set the selected filter
  };

  const handleRemoteFilterChange = (remote) => {
    setSelectedRemoteFilter(remote);
  };
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClearFilters = () => {
    setSelectedJobTypeFilter('');
    setSelectedPayTypeFilter('');
    setSelectedRemoteFilter('');
    setFilterOpen(false);
  };

  const toggleErrors = (toggle) => {
    setShowTitleError(toggle);
    setShowTypeError(toggle);
    setShowDescriptionError(toggle);
    setShowEmployerError(toggle);
    setShowSalaryError(toggle);
    setShowHourlyPayError(toggle);
    setShowWeeklyHoursError(toggle);
    setShowScheduleError(toggle);
    setShowReqQualError(toggle);
    setShowRemoteError(toggle);
  }

  return (
    <div>
      <div className="bg-dark text-white">
        <div
          id="navbar"
          style={{
            display: "flex",
            paddingBlock: ".5em",
            justifyContent: "space-between",
            alignItems: "left",
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
          <button type='button' className='btn btn-danger' id='sidebarCollapse'>
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
  <div className="row mt-3">
    <div className="col-md-8 offset-md-2">
      <div className="btn-group" role="group" aria-label="Filter by Job Type">
        <button
          type="button"
          className={`btn ${selectedJobTypeFilter === 'Full-Time' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleJobTypeFilterChange('Full-Time')}
        >
          Full-Time
        </button>
        <button
          type="button"
          className={`btn ${selectedJobTypeFilter === 'Part-Time' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleJobTypeFilterChange('Part-Time')}
        >
          Part-Time
        </button>
        <button
          type="button"
          style={{marginRight: '5px'}}
          className={`btn ${selectedJobTypeFilter === 'Contract' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleJobTypeFilterChange('Contract')}
        >
          Contract
        </button>
      </div>

      <div className="btn-group" role="group" aria-label="Filter by Pay Type">
        <button
          type="button"
          className={`btn ${selectedPayTypeFilter === 'Salary' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handlePayTypeFilterChange('Salary')}
        >
          Salary
        </button>
        <button
          type="button"
          style={{marginRight: '5px'}}
          className={`btn ${selectedPayTypeFilter === 'Hourly' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handlePayTypeFilterChange('Hourly')}
        >
          Hourly
        </button>
      </div>

      <div className="btn-group" role="group" aria-label="Filter by Remote">
        <button
          type="button"
          className={`btn ${selectedRemoteFilter === 'Remote' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleRemoteFilterChange('Remote')}
        >
          Remote
        </button>
        <button
          type="button"
          style={{marginRight: '5px'}}
          className={`btn ${selectedRemoteFilter === 'On-Site' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handleRemoteFilterChange('On-Site')}
        >
          On-Site
        </button>
      </div>
    </div>
  </div>
)}

              

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
                {filteredJobs.map((job, index) => (
                  <tr key={job._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{job.title}</td>
                    <td>{job.salary}</td>
                    <td>{job.location}</td>
                    <td>
                      <button className="btn btn-primary mr-2" onClick={() => handleEdit(job)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleShowDeleteModal(job)}>Delete</button>
                      <Link to='/job-details' state={{id: job._id, isAdmin: true}} className="btn btn-success mr-2">View</Link>
                      {/* <Link
                      to={{
                        pathname: "/job-details",
                        state: { 
                          title: job.title,
                          type: job.type,
                          description: job.description,
                          employer: job.employer,
                          payType: job.payType,
                          salary: job.salary,
                          hourlyPay: job.hourlyPay,
                          schedule: job.schedule,
                          weeklyHours: job.weeklyHours,
                          reqQual: job.reqQual,
                          prefQual: job.prefQual,
                          loc: job.location,
                          remote: job.remote,
                          benefits: job.benefits
                        }
                      }}
                      className="btn btn-success mr-2"
                    >
                      View
                    </Link> */}
                     
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

      <div id="content" className='container ml-5 p-3'>
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
            <h2 className='d-flex justify-content-center'> {editJobData ? 'Edit Job' : 'Create Jobs ( * indicates Required Field)'}</h2>
            <div className='d-flex justify-content-center'>
              <form onSubmit={handleSubmit}>
                
                <div className="form-group row">
                  <label htmlFor="titleError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showTitleError ? '* Title is required' : ''}</label>
                  <label htmlFor="title" className="label" style={{marginBottom:"0px"}}>Title*</label>
                  <input type="text" className="textField-small" id="title" style={{backgroundColor:"white"}}
                  value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                
              
                <div className="form-group row">
                    <label htmlFor="typeError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showTypeError ? '* Job Type is required' : ''}</label>
                    <label htmlFor="type" className="label" style={{marginBottom:"0px"}}>Job Type*</label>
                    <select 
                        id="type"
                        className="textField-small" 
                        value={type} 
                        onChange={(e) => setType(e.target.value)} 
                        required 
                    >
                        <option value="">Select Job Type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
                
              
                <div className="form-group row">
                  <label htmlFor="descriptionError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showDescriptionError ? '* Description is required' : ''}</label>
                  <label htmlFor="description" className="label" style={{marginBottom:"0px"}}>Description*</label>
                  <textarea type="text" className="textField-large" id="description" style={{height:"100px"}}
                  value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                

                <div className="form-group row">
                  <label htmlFor="employerError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showEmployerError ? '* Employer is required' : ''}</label>
                  <label htmlFor="employer" className="label" style={{marginBottom:"0px"}}>Employer*</label>
                  <input type="text" className="textField-small" id="employer" style={{backgroundColor:"white"}}
                  value={employer} onChange={(e) => setEmployer(e.target.value)} required />
                </div>
                
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="payType" className="label" style={{marginBottom:"0px", marginTop:"-30px"}}>Pay Type</label>
                  <select 
                        id="type"
                        className="textField-small" 
                        value={payType} 
                        onChange={(e) => setPayType(e.target.value)} 
                        required 
                    >
                        <option value="">Select Pay Type</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Salary">Salary</option>
                    </select>
                </div>
                

                <div className="form-group row">
                  <label htmlFor="salaryError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showSalaryError ? '* Salary must be a number' : ''}</label>
                  <label htmlFor="salary" className="label" style={{marginBottom:"0px"}}>Yearly Salary (USD)</label>
                  <input type="text" className={`textField-small ${!isSalaryValid}`} id="salary" style={{backgroundColor:"white"}}
                  value={salary} onChange={handleSalaryChange} />
                </div>
                
                <div className="form-group row">
                  <label htmlFor="hourlyPayError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showHourlyPayError ? '* Hourly Pay must be a number' : ''}</label>
                  <label htmlFor="hourlyPay" className="label" style={{marginBottom:"0px"}}>Hourly Pay (USD)</label>
                  <input type="text" className={`textField-small ${!isHourlyPayValid}`} id="hourlyPay" style={{backgroundColor:"white"}}
                  value={hourlyPay} onChange={handleHourlyPayChange}/>
                </div>
                
                <div className="form-group row">
                  <label htmlFor="scheduleError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showScheduleError ? '* Schedule is required' : ''}</label>
                  <label htmlFor="schedule" className="label" style={{marginBottom:"0px"}}>Schedule*</label>
                  <input type="text" className="textField-small" id="schedule" style={{backgroundColor:"white"}}
                  value={schedule} onChange={(e) => setSchedule(e.target.value)} required />
                </div>
                
                <div className="form-group row">
                  <label htmlFor="weeklyHoursError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showWeeklyHoursError ? '* Weekly Hours must be a number' : ''}</label>
                  <label htmlFor="weeklyHours" className="label" style={{marginBottom:"0px"}}>Weekly Hours*</label>
                  <input type="text" className={`textField-small ${!isWeeklyHoursValid}`} id="weeklyHours" style={{backgroundColor:"white"}}
                  value={weeklyHours} onChange={handleWeeklyHoursChange} required />
                </div>
               
                <div className="form-group row">
                  <label htmlFor="reqQualError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showReqQualError ? '* Required Qualifications is required' : ''}</label>
                  <label htmlFor="reqQual" className="label" style={{marginBottom:"0px"}}>Required Qualifications*</label>
                  <textarea type="text" className="textField-large" id="reqQual" style={{height:"100px"}}
                  value={reqQual} onChange={(e) => setReqQual(e.target.value)} required />
                </div>
                
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="prefQual" className="label" style={{marginBottom:"0px", marginTop:"-30px"}}>Preferred Qualifications</label>
                  <textarea type="text" className="textField-large" id="prefQual" style={{height:"100px"}}
                  value={prefQual} onChange={(e) => setPrefQual(e.target.value)}/>
                </div>
                
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="location" className="label" style={{marginBottom:"0px", marginTop:"-30px"}}>Location</label>
                  <input type="text" className="textField-small" id="location" style={{backgroundColor:"white"}}
                  value={location} onChange={(e) => setLocation(e.target.value)}/>
                </div>

                <div className="form-group row">
                    <label htmlFor="remoteError" className="error" style={{width: "200px", color: "red", marginBottom: "0px", marginTop: "10px"}}>{showRemoteError ? '* Remote is required' : ''}</label>
                    <label htmlFor="remote" className="label" style={{marginBottom:"0px"}}>Remote*</label>
                    <select 
                        id="remote"
                        className="textField-small" 
                        value={remote} 
                        onChange={(e) => setRemote(e.target.value)} 
                        required 
                    >
                        <option value="">Select Remote</option>
                        <option value="Remote">Remote</option>
                        <option value="On-Site">On-Site</option>
                    </select>
                </div>
                
                <div className="form-group row">
                  <label className="col-sm-3 col-form-label">&nbsp;</label>
                  <label htmlFor="benefits" className="label" style={{marginBottom:"0px", marginTop:"-30px"}}>Benefits</label>
                  <textarea type="text" className="textField-small" id="benefits" style={{height:"100px"}}
                  value={benefits} onChange={(e) => setBenefits(e.target.value)}/>
                </div>
                

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