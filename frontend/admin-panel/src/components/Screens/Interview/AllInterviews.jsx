import React, { useState, useEffect } from 'react';
import '../../Styles/Interview/AllInterviews.css';
import AddInterview from './AddInterview';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AllInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [editInterviewData, setEditInterviewData] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/interviews');
      const data = await res.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  const handleDelete = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This interview will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/interviews/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Delete failed');
        fetchInterviews();
        toast.success('Interview deleted successfully!');
      } catch (err) {
        toast.error('Delete failed!');
        console.error(err);
      }
    }
  });
};

  const handleView = (interview) => {
    setSelectedInterview(interview);
    setEditInterviewData(null); // Ensure edit mode is off when viewing
  };

  const handleBack = () => {
    setSelectedInterview(null);
    setEditInterviewData(null);
    fetchInterviews(); // Refresh the list if an update/add happened
  };

  const handleEdit = (interview) => {
    setEditInterviewData(interview);
    setSelectedInterview(null); // Ensure view mode is off when editing
  };

  const handleInterviewSubmit = () => {
    fetchInterviews(); // Refetch interviews after an add or update
    setEditInterviewData(null); // Exit edit/add mode
  };

  return (
    <div className="all-interviews-container">
      {selectedInterview ? (
        <div className="interview-detail-card">
          <div className="interview-detail-content">
            <div className="interview-text-details">
              <h2>{selectedInterview.Name}</h2>
              <p><strong>Company:</strong> {selectedInterview.CompanyName}</p>
              <p><strong>Position:</strong> {selectedInterview.Position}</p>
              <p><strong>Company URL:</strong>{' '}
                <a href={selectedInterview.CompanyURL} target="_blank" rel="noreferrer">
                  {selectedInterview.CompanyURL}
                </a>
              </p>
            </div>
            {selectedInterview.Image && (
              <div className="interview-image-container-right">
                <img
                  src={`http://localhost:5000/uploads/interviews/${selectedInterview.Image}`}
                  alt={selectedInterview.Name}
                  className="interview-detail-image-passport"
                />
              </div>
            )}
          </div>
          <div className="interview-description">
            <h3>Description:</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedInterview.Description }} />
          </div>
          <div className="button-bottom-right-container">
            <button className="back-button" onClick={handleBack}>
              &laquo; Back to List
            </button>
          </div>
        </div>
      ) : editInterviewData ? (
        <AddInterview
          existingInterview={editInterviewData}
          onInterviewSubmit={handleInterviewSubmit}
          onCancel={handleBack}
        />
      ) : (
        <>
          <h2>All Interviews</h2>
          {interviews.length === 0 ? (
            <p>No interviews found</p>
          ) : (
            <div className="table-wrapper">
              <table className="interviews-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((item, idx) => (
                    <tr key={item._id}>
                      <td>{idx + 1}</td>
                      <td>{item.Name}</td>
                      <td>
                        <div className='action-icons'>
                        <i className="fas fa-eye action-icon" title='View' onClick={() => handleView(item)}></i>
                        <i className="fas fa-edit action-icon" title="Edit" onClick={() => handleEdit(item)}></i>
                        <i className="fas fa-trash action-icon" title="Delete" onClick={() => handleDelete(item._id)}></i>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AllInterviews;