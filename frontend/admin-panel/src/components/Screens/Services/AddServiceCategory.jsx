import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/api';

const AddServiceCategory = ({ onClose, fetchServiceCategories, editingServiceCategory }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingServiceCategory) {
      setName(editingServiceCategory.name);
    }
  }, [editingServiceCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const method = editingServiceCategory ? "PUT" : "POST";
    const url = editingServiceCategory
      ? `${API_BASE_URL}/api/servicecategories/${editingServiceCategory._id}`
      : `${API_BASE_URL}/api/servicecategories`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform operation');
      }

      fetchServiceCategories();
      onClose();
      toast.success(editingServiceCategory ? "Service Category updated successfully" : "Service Category added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add/edit service category");
    }
  };

  return (
    <div className="modal-dialog-content">
      <div className="modal-header-row">
        <h3 className="modal-title">{editingServiceCategory ? "Edit Service Category" : "Add Service Category"}</h3>
        <button 
          className="modal-close-icon-btn" 
          type="button" 
          onClick={onClose}
          aria-label="Close dialog"
          title="Close"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="modal-form-group">
          <label className="modal-label" htmlFor="serviceCategoryName">Category Name</label>
          <input
            id="serviceCategoryName"
            className="modal-text-input"
            type="text"
            placeholder="e.g. Web Development, SEO, Consulting"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="modal-actions-row">
          <button 
            type="button" 
            className="modal-cancel-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="modal-submit-btn"
          >
            {editingServiceCategory ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceCategory;