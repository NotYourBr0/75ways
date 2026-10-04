import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const AddTag = ({ onClose, fetchTags, editingTag }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
    }
  }, [editingTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a tag name");
      return;
    }

    const method = editingTag ? "PUT" : "POST";
    const url = editingTag
      ? `http://localhost:5000/api/tags/${editingTag._id}`
      : `http://localhost:5000/api/tags`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to save tag");
      }

      fetchTags();
      onClose();
      toast.success(editingTag ? "Tag updated successfully" : "Tag added successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <div className="modal-dialog-content">
      <div className="modal-header-row">
        <h3 className="modal-title">{editingTag ? "Edit" : "Add"} Tag</h3>
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
          <label className="modal-label" htmlFor="tagName">Tag Name</label>
          <input
            id="tagName"
            className="modal-text-input"
            type="text"
            placeholder="e.g. JavaScript, AI, News"
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
            {editingTag ? "Save Changes" : "Create Tag"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTag;
