import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../Styles/Interview/AddInterview.css';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../config/api';
const initialFormState = { Name: '', CompanyName: '', Description: '', Image: null, Position: '', CompanyURL: '' };

function AddInterview({ existingInterview, onInterviewSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [editorHtmlContent, setEditorHtmlContent] = useState('');
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (existingInterview) {
      setFormData(prev => ({
        ...prev,
        Name: existingInterview.Name || '',
        CompanyName: existingInterview.CompanyName || '',
        Description: existingInterview.Description || '',
        Position: existingInterview.Position || '',
        CompanyURL: existingInterview.CompanyURL || ''
      }));
      setEditorHtmlContent(existingInterview.Description || '');
    } else {
      setFormData(initialFormState);
      setEditorHtmlContent('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [existingInterview]); 

  const handleEditorChange = (content) => {
    setEditorHtmlContent(content);
    setFormData(prev => ({ ...prev, Description: content }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { Name, CompanyName, Description, Image, Position, CompanyURL } = formData;

    if (!Name.trim() || !CompanyName.trim() || !Description.trim() || !Position.trim() || !CompanyURL.trim()) {
      toast.error('Please fill all text fields!');
      return;
    }

    if (!Image && !existingInterview) {
      toast.error('Please select an image for the new interview!');
      return;
    }

    try {
      new URL(CompanyURL)
    } catch (error) {
      toast.error('Please enter a valid Company URL.');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('Name', Name);
    dataToSend.append('CompanyName', CompanyName);
    dataToSend.append('Description', Description);
    dataToSend.append('Position', Position);
    dataToSend.append('CompanyURL', CompanyURL);
    if (Image) { 
      dataToSend.append('Image', Image);
    }

    const url = existingInterview
      ? `${API_BASE_URL}/api/updateinterview/${existingInterview._id}`
      : `${API_BASE_URL}/api/addInterview`;
    const method = existingInterview ? 'PUT' : 'POST';

   try {
  const response = await fetch(url, {
    method,
    body: dataToSend,
  });

  const result = await response.json();

  if (response.ok) {
    toast.success(existingInterview ? 'Interview updated successfully!' : 'Interview added successfully!');

    //  Reset form after successful add (not edit)
    if (!existingInterview) {
      setFormData(initialFormState);
      setEditorHtmlContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    //  Trigger the callback after success
    if (onInterviewSubmit) {
      onInterviewSubmit();
    }

  } else {
    toast.error(`Error: ${result.message || 'Failed to process request.'}`);
    console.error('Backend error:', result);
  }

} catch (error) {
  console.error('Submission error:', error);
  toast.error('Failed to submit interview. Please check your network connection and server.');
}

  };

  return (
    <div className="all-interviews-container">
       {existingInterview ? <div onClick={onCancel}>
            <button className="backbutton" >
              &laquo; Back to List
            </button> 
          </div>: ''}
    <form className="add-interview-form" onSubmit={handleSubmit}>
     
      <h2 className="form-heading">
        {existingInterview ? 'Edit Interview' : 'Add New Interview'}
      </h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="Name">Name:</label>
          <input type="text" id="Name" name="Name" value={formData.Name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="CompanyName">Company Name:</label>
          <input type="text" id="CompanyName" name="CompanyName" value={formData.CompanyName} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="Position">Position:</label>
          <input type="text" id="Position" name="Position" value={formData.Position} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="CompanyURL">Company URL:</label>
          <input type="url" id="CompanyURL" name="CompanyURL" value={formData.CompanyURL} onChange={handleChange} required />
        </div>
      </div>

      <div className="description-group">
        <label htmlFor="Description">Description:</label>
        <Editor
          apiKey="k1qvo3lhodr069d0svk11nwg850yqjt6gmdutf5b6l7ng1of"
          init={{
            height: 200,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
              'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount'
            ],
            toolbar: `undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help`
          }}
          value={editorHtmlContent}
          onEditorChange={handleEditorChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageInput">Image:</label>
        <input
          type="file"
          id="imageInput"
          name="Image"
          accept="image/*"
          onChange={handleChange}
          required={!existingInterview || !existingInterview.Image}
          ref={fileInputRef}
        />
        {existingInterview && existingInterview.Image && (
          <p>Current Image: {existingInterview.Image}</p>
        )}
      </div>

      <div className="formbuttons">
        <button type="submit" className="submitbtns">
          {existingInterview ? 'Update' : 'Submit'}
        </button>
        {onCancel && (
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form></div>
  );
}

export default AddInterview;