import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../../../config/api';

const AddCategory = ({ onClose, fetchCategories, editingCategory }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${API_BASE_URL}/api/categories/${editingCategory._id}`
      : `${API_BASE_URL}/api/categories`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to save category");
      }

      fetchCategories();
      onClose();
      toast.success(editingCategory ? "Category updated successfully" : "Category added successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="modal-dialog-content">
      <div className="modal-header-row">
        <h3 className="modal-title">{editingCategory ? "Edit" : "Add"} Category</h3>
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
          <label className="modal-label" htmlFor="categoryName">Category Name</label>
          <input
            id="categoryName"
            className="modal-text-input"
            type="text"
            placeholder="e.g. Technology, Automotive, Lifestyle"
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
            {editingCategory ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
