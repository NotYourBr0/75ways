import React, { useEffect, useState, useContext } from "react";
import AddTag from "./AddTags";
import '../../Styles/Tags/Tags.css';
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext'; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const searchTerm = useContext(SearchContext);
  const { isAdmin } = useContext(AuthContext); 

  const fetchTags = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tags");
      const data = await res.json();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  const handleDelete = async (id) => {
  if (!isAdmin) {
    toast.error("Only Admin has the access for this feature");
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "This tag will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:5000/api/tags/${id}`, {
          method: "DELETE",
        });
        toast.success("Tag deleted successfully");
        fetchTags();
      } catch (error) {
        console.error("Failed to delete tag:", error);
        toast.error("Failed to delete tag");
      }
    }
  });
};


  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return tag.name.toLowerCase().includes(lowerCaseSearchTerm);
  });

  return (
    <div className="blog-container">
      <div className="content-header">
        <div className="tag-head">
          <h2 style={{ margin: 0 }}>Tags</h2>
        </div>

        <button
          className="btnss"
          onClick={() => {
            if (!isAdmin) return toast.error(" Only Admin has the access for this feature");
            setEditingTag(null);
            setOpenPopup(true);
          }}>
          <span className='buttonss'>+</span>
          <span className='buttonss'>Add Tags</span>
        </button>
      </div>

      <div className="table-wrapper">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Sr</th>
              <th>Name</th>
              <th>Post Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.length === 0 ? (
              <tr>
                <td colSpan="4">No tags found.</td>
              </tr>
            ) : (
              filteredTags.map((tag, index) => (
                <tr key={tag._id}>
                  <td>{index + 1}</td>
                  <td>{tag.name}</td>
                  <td>{tag.postCount}</td>
                  <td>
                    <div className="action-icons">
                      <i
                        className="fas fa-edit action-icon"
                        onClick={() => {
                          if (!isAdmin) return toast.error(" Only Admin has the access for this feature");
                          setEditingTag(tag);
                          setOpenPopup(true);
                        }}
                      ></i>
                      <i
                        className="fas fa-trash action-icon"
                        onClick={() => handleDelete(tag._id)}
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
          className="tagpopup"
          onClick={() => {
            setOpenPopup(false);
            setEditingTag(null);
          }}
        >
          <div className="tagcontent" onClick={(e) => e.stopPropagation()}>
            <AddTag
              onClose={() => {
                setOpenPopup(false);
                setEditingTag(null);
              }}
              fetchTags={fetchTags}
              editingTag={editingTag}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;
