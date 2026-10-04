import React, { useState, useEffect } from 'react';
import '../../Styles/Services/AllServices.css';
import AddServices from './AddServices';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../config/api';

function AllServices() {
const [services, setServices] = useState([]);
const [selectedService, setSelectedService] = useState(null);
const [editServiceData, setEditServiceData] = useState(null);

useEffect(() => {
fetchServices();
}, []);

const fetchServices = async () => {
try {
const res = await fetch(`${API_BASE_URL}/api/services`);
if (!res.ok) {
throw new Error(`HTTP error! status: ${res.status}`);
}
const data = await res.json();
setServices(data);
} catch (error) {
console.error('Error fetching services:', error);
toast.error('Failed to fetch services!');
}
};

const handleDelete = async (id) => {
Swal.fire({
title: 'Are you sure?',
text: 'This service will be permanently deleted!',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Yes, delete it!',
cancelButtonText: 'Cancel'
}).then(async (result) => {
if (result.isConfirmed) {
try {
const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
method: 'DELETE',
});
if (!res.ok) throw new Error('Delete failed');
fetchServices();
toast.success('Service deleted successfully!');
} catch (err) {
toast.error('Delete failed!');
console.error(err);
}
}
});
};

const handleView = (service) => {
setSelectedService(service);
setEditServiceData(null);
};

const handleBack = () => {
setSelectedService(null);
setEditServiceData(null);
fetchServices();
};

const handleEdit = (service) => {
setEditServiceData(service);
setSelectedService(null);
};

const handleServiceSubmit = () => {
fetchServices();
setEditServiceData(null);
};

// Group services by category
const groupedServices = services.reduce((acc, service) => {
const categoryName = service.category || 'Uncategorized'; // Handle services without a category
if (!acc[categoryName]) {
acc[categoryName] = [];
}
acc[categoryName].push(service);
return acc;
}, {});

// Sort categories alphabetically for consistent display
const sortedCategoryNames = Object.keys(groupedServices).sort();

return (
<div className="all-services-container">
{selectedService ? (
<div className="interview-detail-card">
<div className="interview-detail-content">
<div className="interview-text-details">
<h2>{selectedService.category}</h2>
<p className="service-name-label"><strong>Service :</strong> {selectedService.serviceName}</p> 
</div>
{selectedService.image && (
<div className="interview-image-container-right">
<img
src={`${API_BASE_URL}/uploads/services/${selectedService.image}`}
alt={selectedService.category}
className="interview-detail-image-passport"
style={{borderRadius:'10px', width:'100%'}}
/>
</div>
)}
</div>
<div className="service-description">
<h3  style={{fontWeight:'lighter'}}>Description:</h3>
<div dangerouslySetInnerHTML={{ __html: selectedService.description }} />
</div>
<div className="button-bottom-right-container">
<button className="back-button" onClick={handleBack}>
&laquo; Back to List
</button>
</div>
</div>
) : editServiceData ? (
<AddServices
existingService={editServiceData}
onServiceSubmit={handleServiceSubmit}
onCancel={handleBack}
/>
) : (
<>
<h2>All Services</h2>
{/* Removed the "Add New Service" button as requested */}

{services.length === 0 ? (
<p>No services found.</p>
) : (
<div className="table-wrapper">
<table className="services-table">
<thead>
<tr>
<th>Sr. No.</th>
<th style={{textAlign:'center'}}>Service Name</th>
<th style={{textAlign:'center'}}>Action</th>
</tr>
</thead>
<tbody>
{sortedCategoryNames.map((categoryName) => (
<React.Fragment key={categoryName}>
{/* Category Header Row */}
<tr className="category-header-row">
<td colSpan="3"> {/* Span across all columns */}
<h3 style={{fontWeight:'lighter', display:'flex', flexDirection:'row'}}><p style={{ color:'#146bc9ff'}}>Category︰ </p><p style={{textDecoration:'underline'}}>{categoryName}</p></h3>
</td>
</tr>
{/* Services within this category */}
{groupedServices[categoryName].map((item, serviceIdx) => (
<tr key={item._id}>
<td>{serviceIdx + 1}</td> {/* Per-category serial number */}
<td style={{fontWeight:'lighter', textAlign:'center'}}>{item.serviceName}</td>
<td>
<div className='action-icons'>
<i className="fas fa-eye action-icon" title='View' onClick={() => handleView(item)}></i>
<i className="fas fa-edit action-icon" title="Edit" onClick={() => handleEdit(item)}></i>
<i className="fas fa-trash action-icon" title="Delete" onClick={() => handleDelete(item._id)}></i>
</div>
</td>
</tr>
))}
</React.Fragment>
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

export default AllServices;
