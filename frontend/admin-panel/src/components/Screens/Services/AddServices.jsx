import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../../Styles/Services/AddServices.css';
import { toast } from 'react-toastify';
const initialFormState = {
  category: '',
  serviceName: '', // Changed from service1 and service2
  description: '',
  image: null,
};

function AddServices({ existingService, onServiceSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [editorHtmlContent, setEditorHtmlContent] = useState('');
  const [serviceCategories, setServiceCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Effect to fetch service categories on component mount
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/servicecategories");
        if (!res.ok) {
          throw new Error('Failed to fetch service categories');
        }
        const data = await res.json();
        setServiceCategories(data);
      } catch (error) {
        console.error("Error fetching service categories:", error);
        toast.error("Failed to load service categories for dropdown.");
      }
    };
    fetchServiceCategories();
  }, []);

  // Effect to populate form data when editing an existing service
  useEffect(() => {
    if (existingService) {
      setFormData(prev => ({
        ...prev,
        category: existingService.category || '',
        serviceName: existingService.serviceName || '', // Changed from service1 and service2
        description: existingService.description || '',
        image: null
      }));
      setEditorHtmlContent(existingService.description || '');
    } else {
      setFormData(initialFormState);
      setEditorHtmlContent('');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [existingService]);

  const handleEditorChange = (content) => {
    setEditorHtmlContent(content);
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Changed service1, service2 to serviceName
    const { category, serviceName, description, image } = formData; 

    if (!category.trim() || !serviceName.trim() || !description.trim()) { // Adjusted validation
      toast.error('Please fill in all required fields!');
      return;
    }

    if (!existingService && !image) {
      toast.error('Please select an image for the service!');
      return;
    }

    const serviceData = new FormData();
    serviceData.append('category', category);
    serviceData.append('serviceName', serviceName); // Changed from service1 and service2
    serviceData.append('description', description);
    if (image) {
      serviceData.append('image', image);
    }

    try {
      const url = existingService
        ? `http://localhost:5000/api/services/${existingService._id}`
        : 'http://localhost:5000/api/addService';

      const method = existingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: serviceData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'API call failed');
      }

      toast.success(existingService ? 'Service updated successfully!' : 'Service added successfully!');

      setFormData(initialFormState);
      setEditorHtmlContent('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onServiceSubmit) {
        onServiceSubmit();
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(`Failed to ${existingService ? 'update' : 'add'} service: ${err.message}`);
    }
  };

  return (
    <div className="all-service-container">
      {existingService && (
        <div onClick={onCancel}>
          <button className="backbutton">&laquo; Back to List</button>
        </div>
      )}

      <form className="add-service-form" onSubmit={handleSubmit}>
        <h2 className="form-heading" style={{fontWeight:'lighter'}}>
          {existingService ? 'Edit Service' : 'Add New Service'}
        </h2>

        <div className="form-row">
          <div className="form-group" >
            <label htmlFor="category" style={{fontWeight:'lighter'}}>Service Category:</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              {serviceCategories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Replaced service1 and service2 inputs with a single serviceName input */}
        <div className="form-row">
          <div className="form-group" style={{ flex: '1 1 100%' }}> {/* Make it take full row width */}
            <label htmlFor="serviceName" style={{fontWeight:'lighter'}}>Service Name:</label>
            <input 
              type="text" 
              id="serviceName" 
              name="serviceName" 
              value={formData.serviceName} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="description-group">
          <label htmlFor="description" style={{fontWeight:'lighter'}}>Description:</label>
          <Editor
            apiKey="k1qvo3lhodr069d0svk11nwg850yqjt6gmdutf5b6l7ng1of"
            init={{
              height: 200,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
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
          <label htmlFor="imageInput" style={{fontWeight:'lighter'}}>Image:</label>
          <input
            type="file"
            id="imageInput"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required={!existingService || !existingService.image} 
            ref={fileInputRef}
          />
          {existingService && existingService.image && (
            <p>Current Image: {existingService.image}</p>
          )}
        </div>

        <div className="formbuttons">
          <button type="submit" className="submitbtns">
            {existingService ? 'Update Service' : 'Add Service'}
          </button>
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddServices;
