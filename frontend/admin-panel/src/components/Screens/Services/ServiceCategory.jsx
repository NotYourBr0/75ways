import React, { useEffect, useState, useContext } from "react";
import AddServiceCategory from "./AddServiceCategory"; // Import the new AddServiceCategory component
import '../../Styles/Category/Category.css'; // You can reuse or create a new CSS file
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../config/api';

const ServiceCategory = () => {
  const [serviceCategories, setServiceCategories] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editingServiceCategory, setEditingServiceCategory] = useState(null);
  const { isAdmin } = useContext(AuthContext);
  const searchTerm = useContext(SearchContext);

  const fetchServiceCategories = async () => {
    try {
      // *** IMPORTANT: Adjust this URL to your actual backend endpoint for service categories ***
      const res = await fetch(`${API_BASE_URL}/api/servicecategories`);
      const data = await res.json();
      setServiceCategories(data);
    } catch (error) {
      console.error("Failed to fetch service categories:", error);
      toast.error("Failed to fetch service categories");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This service category will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // *** IMPORTANT: Adjust this URL to your actual backend endpoint for service categories ***
          const response = await fetch(`${API_BASE_URL}/api/servicecategories/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete service category');
          }

          toast.success("Service Category deleted successfully");
          fetchServiceCategories();
        } catch (error) {
          console.error("Failed to delete service category:", error);
          toast.error(error.message || "Failed to delete service category");
        }
      }
    });
  };

  useEffect(() => {
    fetchServiceCategories();
  }, []);

  const filteredServiceCategories = serviceCategories.filter(cat => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return cat.name.toLowerCase().includes(lowerCaseSearchTerm);
  });

  return (
    <div className="blog-container"> {/* Reusing this class for general layout */}
      <div className="content-header">
        <div className="catry">
          <h5 style={{ margin: 0 }}>Service Categories</h5>
        </div>
        <button
          className="btns" // Reusing button classes
          onClick={() => {
            setEditingServiceCategory(null);
            setOpenPopup(true);
          }}>
          <span className='buttons'>+</span>
          <span className='buttons'>Add Service Category</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table className="blog-table"> {/* Reusing table classes */}
          <thead>
            <tr>
              <th>Sr</th>
              <th>Service Category</th> {/* Changed from 'Name' to 'Service Category' */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServiceCategories.length === 0 ? (
              <tr>
                <td colSpan="3">No service categories found.</td> {/* Adjusted colspan to 3 */}
              </tr>
            ) : (
              filteredServiceCategories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                  <td>
                    <div className="action-icons">
                      <i
                        className="fas fa-edit action-icon"
                        onClick={() => {
                          if (!isAdmin) return toast.error("Only Admin has the access for this feature");
                          setEditingServiceCategory(cat);
                          setOpenPopup(true);
                        }}
                      ></i>
                      <i
                        className="fas fa-trash action-icon"
                        onClick={() => {
                          if (!isAdmin) return toast.error("Only Admin has the access for this feature");
                          handleDelete(cat._id);
                        }}
                      ></i>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openPopup && (
        <div 
          className="catpopup"
          onClick={() => {
            setOpenPopup(false);
            setEditingServiceCategory(null);
          }}
        >
          <div className="catcontent" onClick={(e) => e.stopPropagation()}>
            <AddServiceCategory
              onClose={() => {
                setOpenPopup(false);
                setEditingServiceCategory(null);
              }}
              fetchServiceCategories={fetchServiceCategories} // Pass the new fetch function
              editingServiceCategory={editingServiceCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCategory;