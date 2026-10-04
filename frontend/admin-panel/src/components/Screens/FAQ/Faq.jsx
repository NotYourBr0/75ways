// src/components/FAQ/Faq.jsx
import React, { useEffect, useState, useContext } from "react";
import AddFaq from "./AddFaq";
import '../../Styles/Category/Category.css'; // Using the existing CSS file
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Icons for edit, delete, and add
import { API_BASE_URL } from '../../../config/api';

const Faq = () => {
const [faqs, setFaqs] = useState([]);
const [openPopup, setOpenPopup] = useState(false);
const [editingFaq, setEditingFaq] = useState(null);
const [expandedFaqId, setExpandedFaqId] = useState(null); // State to track which FAQ's answer is expanded
const { isAdmin } = useContext(AuthContext);
const { searchTerm } = useContext(SearchContext) || {};

const fetchFaqs = async () => {
try {
const res = await fetch(`${API_BASE_URL}/api/faqs`); // Assuming a new API endpoint for FAQs
const data = await res.json();
setFaqs(data);
} catch (error) {
console.error("Failed to fetch FAQs:", error);
}
};

const handleDelete = async (id) => {
Swal.fire({
title: 'Are you sure?',
text: "This FAQ will be permanently deleted!",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#d33',
cancelButtonColor: '#3085d6',
confirmButtonText: 'Yes, delete it!',
cancelButtonText: 'Cancel'
}).then(async (result) => {
if (result.isConfirmed) {
try {
await fetch(`${API_BASE_URL}/api/faqs/${id}`, {
method: "DELETE",
});
toast.success("FAQ deleted successfully");
fetchFaqs();
} catch (error) {
console.error("Failed to delete FAQ:", error);
toast.error("Failed to delete FAQ");
}
}
});
};

useEffect(() => {
fetchFaqs();
}, []);

// Function to toggle the answer visibility
const handleQuestionClick = (id) => {
setExpandedFaqId(expandedFaqId === id ? null : id);
};

const filteredFaqs = faqs.filter(faq => {
const lowerCaseSearchTerm = searchTerm?.toLowerCase() || '';
return (
(faq.question?.toLowerCase().includes(lowerCaseSearchTerm)) ||
(faq.answer?.toLowerCase().includes(lowerCaseSearchTerm))
);
});

return (
<div className="blog-container">
<div className="content-header">
<div className="catry">
<h5 style={{ margin: 0 }}>FAQs</h5>
</div>
<button
className="btns"
onClick={() => {
setEditingFaq(null);
setOpenPopup(true);
}}>
<span className='buttons'><FaPlus /></span>
<span className='buttons'>Add FAQ</span>
</button>
</div>

<div className="table-wrapper">
<table className="blog-table">
<thead>
<tr>
<th>Sr</th>
<th>Question</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{filteredFaqs.length === 0 ? (
<tr>
<td colSpan="3">No FAQs found.</td>
</tr>
) : (
filteredFaqs.map((faq, index) => (
<React.Fragment key={faq._id}>
<tr onClick={() => handleQuestionClick(faq._id)}>
<td>{index + 1}</td>
<td className="faq-question-cell">{faq.question}</td>
<td>
<div className="action-icons">
<FaEdit
className="action-icon"
onClick={(e) => {
e.stopPropagation(); // Prevents the row's onClick from firing
if (!isAdmin) return toast.error("Only Admin has the access for this feature");
setEditingFaq(faq);
setOpenPopup(true);
}}
/>
<FaTrash
className="action-icon"
onClick={(e) => {
e.stopPropagation(); // Prevents the row's onClick from firing
if (!isAdmin) return toast.error("Only Admin has the access for this feature");
handleDelete(faq._id);
}}
/>
</div>
</td>
</tr>
{expandedFaqId === faq._id && (
<tr>
<td colSpan="3" className="faq-answer-cell">
<div className="faq-answer-content">{faq.answer}</div>
</td>
</tr>
)}
</React.Fragment>
))
)}
</tbody>
</table>
</div>

{openPopup && (
<div className="catpopup">
<div className="catcontent">
<AddFaq
onClose={() => {
setOpenPopup(false);
setEditingFaq(null);
}}
fetchFaqs={fetchFaqs}
editingFaq={editingFaq}
/>
</div>
</div>
)}
</div>
);
};

export default Faq;