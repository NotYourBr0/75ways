// src/AddBlog.jsx

import React, { useState, useEffect } from 'react';
import '../../Styles/Blog/Addblog.css'; // Ensure this CSS file exists
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/api';
function AddBlog({ onSubmit, onClose, blogToEdit, show }) {
  const [formData, setFormData] = useState({
    text: '',
    cat: '',
    tags: '',
    status: '✅Published',
    description: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // NEW: State for showing general status messages (success/error)
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [value, setValue] = useState(''); // For ReactQuill content

  // --- Cloudinary Configuration ---
  const CLOUDINARY_CLOUD_NAME = 'dezcjamsl'; // Your actual Cloud Name
  const CLOUDINARY_UPLOAD_PRESET = 'blog_unsigned_preset'; // Your actual upload preset

  useEffect(() => {
    // Fetch Categories
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories:", err));

    // Fetch Tags
    fetch(`${API_BASE_URL}/api/tags`)
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(err => console.error("Failed to fetch tags:", err));
  }, []);

  useEffect(() => {
    if (blogToEdit) {
      setFormData({
        text: blogToEdit.text || '',
        cat: blogToEdit.category?._id || '',
        tags: Array.isArray(blogToEdit.tags)
          ? blogToEdit.tags.map(tag => tag.name).join(',')
          : '',
        status: blogToEdit.status || '✅Published',
        description: blogToEdit.description || ''
      });
      setValue(blogToEdit.description || '');
      setUploadedImageUrl(blogToEdit.image || '');
      setSelectedFile(null);
    } else {
      // Reset form fields when opening for a new blog
      setFormData({
        text: '',
        cat: '',
        tags: '',
        status: '✅Published',
        description: ''
      });
      setValue('');
      setUploadedImageUrl('');
      setSelectedFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      // Clear messages when starting a new blog entry
      setStatusMessage(null);
      setMessageType(null);
    }
  }, [blogToEdit, show]);

  // Update formData description from quill value
  useEffect(() => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, [value]);

  const valueupdate = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setStatusMessage(null); // Clear any previous messages
      setMessageType(null);
     
    } else {
      setSelectedFile(null);
      setUploadedImageUrl('');
      
    }
  };

  const handleUploadImage = async () => {
    

    if (!selectedFile) {
      setStatusMessage("Please select an image file first.");
      setMessageType('error');
     
      return;
    }

  

    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage(null); // Clear previous messages
    setMessageType(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      );

      setUploadedImageUrl(response.data.secure_url);
      setIsUploading(false);
      setUploadProgress(100);
      // NEW: Set success message
      setStatusMessage('Image uploaded successfully to Cloudinary!');
      setMessageType('success');
      setTimeout(() => setStatusMessage(null), 5000); // Clear message after 5 seconds
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // NEW: Set error message
      setStatusMessage(`Upload failed: ${error.response?.data?.error?.message || error.message}`);
      setMessageType('error');
      setIsUploading(false);
      setUploadProgress(0);
      setTimeout(() => setStatusMessage(null), 7000); // Clear error message after 7 seconds
    }
  };

  const handleTagChange = (tagName, checked) => {
    const currentTagsSet = new Set(formData.tags.split(',').filter(Boolean));
    let updatedTagsArray = [];

    if (checked) {
      if (currentTagsSet.size >= 3) return; // Max 3 tags
      currentTagsSet.add(tagName);
    } else {
      currentTagsSet.delete(tagName);
    }
    updatedTagsArray = Array.from(currentTagsSet);

    setFormData(prev => ({
      ...prev,
      tags: updatedTagsArray.join(',')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { text, cat, tags, status, description } = formData;

    if (!text || !cat || !tags || !status || !description) {
      toast.error('Please fill all required fields!'); // Keep toast.error for form validation
      return;
    }

    if (!blogToEdit && !uploadedImageUrl) {
        toast.error('Please upload an image for the new blog before submitting!');
        return;
    }

    if (blogToEdit && selectedFile && !uploadedImageUrl) {
        toast.error('Please click "Upload Image to Cloud" to finish uploading the new image before updating!');
        return;
    }

    const dataToSend = {
      text,
      description,
      category: cat,
      tags: tags,
      status,
      image: uploadedImageUrl || (blogToEdit ? blogToEdit.image : null)
    };

    try {
      const url = blogToEdit
        ? `${API_BASE_URL}/api/blogs/update/${blogToEdit._id}`
        : `${API_BASE_URL}/api/blogs/create`;

      const method = blogToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await res.json();

      if (res.ok) {
        onSubmit(responseData);
        onClose(); // Close the modal after successful submission
blogToEdit ? toast.success('Blog updated Successfully') : toast.success('Blog addeed Successfully')      
} else {
        toast.error("Failed: " + (responseData?.message || res.statusText || "Unknown Error"));
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
      toast.error("Error submitting blog: " + err.message);
    }
  };

  const selectedTags = formData.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  return (
    <div className={`addblog-modal-overlay ${show ? 'show-modal' : ''}`}>
      <div className="addblog-modal-box">
        <button className="addblog-close-button" onClick={onClose}>×</button>

        <form className="addblog-form" onSubmit={handleSubmit}>
          <h2 className="formheading">{blogToEdit ? "Update Blog" : "Add New Blog"}</h2>

         
          <label>Blog-Title:</label>
          <input
            type="text"
            name="text"
            className="text"
            value={formData.text}
            onChange={valueupdate}
            required
          />

          <label>Category:</label>
          <select
            name="cat"
            value={formData.cat}
            onChange={valueupdate}
            required
            className="form-select-styled" // NEW CLASS for styling
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Tags (max 3):</label>
          <div className="tag-checkbox-group"> {/* NEW WRAPPER for tags */}
            {tags.map(tag => (
              <label
                key={tag._id}
                className={`tag-checkbox-label ${selectedTags.includes(tag.name) ? 'selected' : ''}`} // NEW CLASSES for styling
              >
                <input
                  type="checkbox"
                  value={tag.name}
                  checked={selectedTags.includes(tag.name)}
                  onChange={(e) => handleTagChange(tag.name, e.target.checked)}
                  disabled={selectedTags.length >= 3 && !selectedTags.includes(tag.name)} // Disable if max 3 tags and not already selected
                />
                {tag.name}
              </label>
            ))}
          </div>

          <label>Status:</label>
          <select
            name="status"
            className="status form-select-styled" // NEW CLASS for styling
            value={formData.status}
            onChange={valueupdate}
            required
          >
            <option value="✅Published">✅Published</option>
            <option value="❌Unpublished">❌Unpublished</option>
          </select>

          <label style={{ marginTop: '14px' }}>Description:</label>
          <ReactQuill
            name="description"
            value={value}
            onChange={setValue}
            theme="snow"
            style={{ height: '200px', marginBottom: '20px' }}
          />

          <label className="image">Image:</label>
          <input
            type="file"
            accept="image/*"
            name="imageFile"
            onChange={handleFileChange}
            required={!blogToEdit && !uploadedImageUrl}
          />
          <button
            type="button"
            onClick={handleUploadImage}
            disabled={!selectedFile || isUploading}
            className="upload-image-button"
          >
            {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Upload Image to Cloud'}
          </button>

          {isUploading && uploadProgress < 100 && (
            <progress value={uploadProgress} max="100" style={{ width: '100%', marginTop: '10px' }}></progress>
          )}
           {/* NEW: Status Message Display */}
          {statusMessage && (
            <div className={`status-message ${messageType}`}>
              {statusMessage}
            </div>
          )}

          {uploadedImageUrl && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ margin: 0 }}>Image Preview:</p>
              <img src={uploadedImageUrl} alt="Uploaded" style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em' }}>View Full Image</a>
            </div>
          )}
          {blogToEdit && blogToEdit.image && !selectedFile && !uploadedImageUrl && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p style={{ margin: 0 }}>Current Image:</p>
              <img src={blogToEdit.image} alt="Existing" style={{ maxWidth: '100px', maxHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }} />
              <a href={blogToEdit.image} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em' }}>View Existing Image</a>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="submitbtn" disabled={isUploading}>
              {blogToEdit ? "Update Blog" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBlog;