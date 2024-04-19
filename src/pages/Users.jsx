import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const navbar = [
  { title: "Dashboard", url: "admin-dashboard" },
  { title: "Manage Jobs", url: "job" },
  { title: "Manage Scholarships", url: "scholarship" },
  { title: "Users", url: "users" },
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const handleFetch = async () => {
    try {
      const response = await axios.get("https://edoponline.netlify.app/api/user/fetch");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://edoponline.netlify.app/api/user/adminDelete/${userId}`);
      // After successful deletion, fetch users again to update the list
      handleFetch();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const formatBirthday = (birthday) => {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
            <h2 style={{ marginInline: "1em", color: "white", textDecoration: "none" }}>
              <Link to="/admin-dashboard" style={{ color: "white", textDecoration: "none" }}>
                ED OP
              </Link>
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
                  <Link to={`/${item.url}`} style={{ color: "white", textDecoration: "none" }}>
                    {item.title}
                  </Link>
                </li>

              ))}
              <Link to = '/create-admin'>
              <button type='button' className='btn btn-success' onClick={() => handleAddAdmin()}>
              Add New Admin
              </button>
              </Link>
            </ul>
          </div>
          <Link to = '/'>
            <button type='button' className='btn btn-danger' id='sidebarCollapse'>
              Logout
            </button>
          </Link>
        </div>
      </div>
      <div id="content" className="container-fluid">
        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Birthday</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{user.username}</td>
                <td>{formatBirthday(user.birthday)}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}