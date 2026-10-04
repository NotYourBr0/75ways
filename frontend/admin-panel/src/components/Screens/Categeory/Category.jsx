import React, { useEffect, useState, useContext } from "react";
import AddCategory from "./AddCategory";
import '../../Styles/Category/Category.css';
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext'; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const Category = () => {
  const [categories, setCategories] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
const { isAdmin } = useContext(AuthContext);
  const searchTerm = useContext(SearchContext);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleDelete = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This category will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: "DELETE",
        });
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  });
};
  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return cat.name.toLowerCase().includes(lowerCaseSearchTerm);
  });

  return (
    <div className="blog-container">
      <div className="content-header">
        <div className="catry"><h5 style={{ margin: 0 }}>Categories</h5></div>
        <button
          className="btns"
          onClick={() => {
            setEditingCategory(null);
            setOpenPopup(true);
          }}><span className='buttons'>+</span>
          <span className='buttons'>Add Category</span></button>
      </div>

      <div className="table-wrapper">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Sr</th> {/* ADDED: Serial Number Header */}
              <th>Name</th>
              <th>Post Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="4">No categories found.</td> {/* Adjusted colspan */}
              </tr>
            ) : (
              filteredCategories.map((cat, index) => ( // ADDED: index to map function
                <tr key={cat._id}>
                  <td>{index + 1}</td> {/* ADDED: Serial Number Data */}
                  <td>{cat.name}</td>
                  <td>{cat.postCount}</td>
                  <td>
                    <div className="action-icons">
                      <i
                        className="fas fa-edit action-icon"
                        onClick={() => {
                          if (!isAdmin) return toast.error("Only Admin has the access for this feature");
                          setEditingCategory(cat);
                          setOpenPopup(true);
                        }}></i>
                      <i
                        className="fas fa-trash action-icon"
                        onClick={() => {
                          if (!isAdmin) return toast.error("Only Admin has the access for this feature");
                          handleDelete(cat._id)}}></i>
                    </div> </td>
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
            setEditingCategory(null);
          }}
        >
          <div className="catcontent" onClick={(e) => e.stopPropagation()}>
            <AddCategory
              onClose={() => {
                setOpenPopup(false);
                setEditingCategory(null);
              }}
              fetchCategories={fetchCategories}
              editingCategory={editingCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;