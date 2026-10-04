import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import '../../Styles/User/User.css';
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext'; 
function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('');
const [showEditModal, setShowEditModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });

  const searchTerm = useContext(SearchContext);
  const { isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (err) {
        if (err.response) {
          setError(`HTTP error! status: ${err.response.status} - ${err.response.data.message || err.message}`);
        } else if (err.request) {
          setError('Network error: No response from server.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  // Filter based on search
  const filteredUsers = users.filter(user => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return user.name.toLowerCase().includes(lowerCaseSearchTerm);
  });

  // Sort
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === 'name') return a.name.localeCompare(b.name);
    if (sortOption === 'email') return a.email.localeCompare(b.email);
    return 0;
  });

  const handleEdit = (user) => {
  if (!isAdmin) {
    alert("Only Admin has the access for this feature.");
    return;
  }

  setSelectedUser(user);
  setEditForm({ name: user.name, email: user.email, phone: user.phone });
  setShowEditModal(true);
};
const handleEditSubmit = async () => {
  const { name, email, phone } = editForm;

  if (!name || !email || !phone) {
    alert("All fields are required!");
    return;
  }

  try {
    await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, {
      name, email, phone
    });

      toast.success("User updated successfully!");

    // Update user in UI
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u._id === selectedUser._id ? { ...u, name, email, phone } : u
      )
    );

    setShowEditModal(false);
    setSelectedUser(null);
  } catch (error) {
    console.error('Update failed:', error);
    toast.error("Failed to update user.");
  }
};
const handleEditChange = (e) => {
  setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};


const handleDelete = (user) => {
    if (!isAdmin) {
    toast.error("Only Admin has the access for this feature.");
    return;
  }
  Swal.fire({
    title: `Delete ${user.name}?`,
    text: "Are you sure you want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${user._id}`);
        toast.success("User deleted successfully");
        setUsers(prevUsers => prevUsers.filter(u => u._id !== user._id));
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete user");
      }
    }
  });
};


  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;
if (!isAdmin) {
    return <h2>Only Admin has the access to this page</h2>;
  }
  
  
  return (
    <div className="blog-container">
      <div className="content-header">
        <div className="user">
          <h2 style={{ margin: 0 }}>Users</h2>
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Sort by (Default)</option>
          <option value="name">Name (A-Z)</option>
          <option value="email">Email (A-Z)</option>
        </select>
      </div>
{showEditModal && (
  <div className="modal-overlay">
    <div className="modal-user">
      <h6>Edit User</h6>
      <input
      className='user-modal'
        type="text"
        name="name"
        value={editForm.name}
        onChange={handleEditChange}
        placeholder="Name"
      />
      <input
            className='user-modal'

        type="email"
        name="email"
        value={editForm.email}
        onChange={handleEditChange}
        placeholder="Email"
      />
      <input
            className='user-modal'

        type="text"
        name="phone"
        value={editForm.phone}
        onChange={handleEditChange}
        placeholder="Phone"
      />

      <div className="modal-buttons">
        <button onClick={handleEditSubmit}>Update</button>
        <button onClick={() => setShowEditModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

      <div className="table-wrapper">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length === 0 ? (
              <tr><td colSpan="5">No users found.</td></tr>
            ) : (
              sortedUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                      <div className="action-icons">
                      <i
                        className="fas fa-edit action-icon"
                        onClick={() => handleEdit(user)}
                      ></i>
                      <i
                        className="fas fa-trash action-icon"
                        onClick={() => handleDelete(user)}
                      ></i>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
