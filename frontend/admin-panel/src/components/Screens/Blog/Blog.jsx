import React, { useEffect, useState, useContext } from 'react';
import AddBlog from './Addblog';
import '../../Styles/Blog/Blog.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SearchContext } from '../Dashboard/homepage';
import { AuthContext } from '../../../context/AuthContext';  
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../config/api';

function Blog() {
  const [showForm, setShowForm] = useState(false);
  const [viewBlog, setViewBlog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);

  const searchTerm = useContext(SearchContext);
  const { isAdmin } = useContext(AuthContext);  

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = (newBlogData) => {
    setShowForm(false);
    fetchBlogs();
    setSelectedBlog(null);
  };

 const handleDelete = async (id) => {
  if (!isAdmin) {
    return toast.error("Only Admin has the access for this feature");
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "This blog will be permanently deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/blogs/delete/${id}`);
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } catch (err) {
        console.error('Failed to delete blog', err);
        toast.error("Failed to delete blog");
      }
    }
  });
};

  // Keep formattedDate as is, it's used for the main blog view popup
  let formattedDate = 'N/A';
  if (selectedBlog && selectedBlog.createdAt) {
    const originalDateString = selectedBlog.createdAt;
    const date = new Date(originalDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    formattedDate = `${day}-${month}-${year}`;
  }
  // Rest of your logic remains unchanged...

  const filteredBlogs = blogs.filter(blog => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      blog.text.toLowerCase().includes(lowerCaseSearchTerm) ||
      blog.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
      blog.category?.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (Array.isArray(blog.tags) && blog.tags.some(tag => tag.name.toLowerCase().includes(lowerCaseSearchTerm))) ||
      blog.status?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div className='blogcontainer'>
      <div className="content-header">
        <h2 className='blog'>Blogs</h2>
        <button
          className="btn"
          onClick={() => {
            setSelectedBlog(null);
            setShowForm(true);
          }}
        >
          <span className='button'>+</span>
          <span className='button'>Add Blog</span>
        </button>
      </div>

      <AddBlog
        show={showForm}
        onSubmit={handleAddBlog}
        onClose={() => {
          setShowForm(false);
          setSelectedBlog(null);
        }}
        blogToEdit={selectedBlog}
      />

      <div className='table-wrapper'>
        <table className="blog-table">
          <thead>
            <tr>
              <th className='sr'>Sr.</th>
              <th>Featured Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th className='action'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length === 0 ? (
              <tr><td colSpan="8">No blogs found.</td></tr>
            ) : (
              filteredBlogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td>{index + 1}</td>
                  <td><img src={blog.image} alt="Blog" className="thumbnail" onError={(e) => { e.target.src = "https://placehold.co/50x50?text=No+Img" }} /></td>
                  <td>{blog.text}</td>
                  <td>
                    <div className='des'
                    style={{cursor:'pointer'}}
                    onClick={() => { setSelectedBlog(blog); setShowDescriptionPopup(true); }} dangerouslySetInnerHTML={{ __html: blog.description?.slice(0, 140) + '...' }} />
                  </td>
                  <td><span className="badge category">{blog.category?.name || 'N/A'}</span></td>
                  <td><span className="badge tag">{blog.tags?.map(tag => tag.name).join(', ') || 'No Tags'}</span></td>
                  <td><span className="badge status">{blog.status}</span></td>
                  <td>
                    <div className='action-icons'>
                      <i className="fas fa-eye action-icon" title='View' onClick={() => { setSelectedBlog(blog); setViewBlog(true); }}></i>

                      <i className="fas fa-edit action-icon" title="Edit" onClick={() => {
                        if (!isAdmin) return toast.error(" Only Admin has the access for this feature");  
                        setSelectedBlog(blog);
                        setShowForm(true);
                      }}></i>

                      <i className="fas fa-trash action-icon" title="Delete" onClick={() => handleDelete(blog._id)}></i>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     {/* Existing Full Blog Details Popup */}
      {viewBlog && selectedBlog && (
        <div className="blogpopup">
          <div className="popupcontent">
            <div className='detail-head'>Blog Details</div>
            <button className='closeblog' onClick={() => {
              setViewBlog(false);
              setSelectedBlog(null);
            }}>Close</button>
            <div className='detail'>
              <div className='info'>
                <img
                  src={selectedBlog.image}
                  alt="Blog"
                  className="pict"
                /><div className='infos'>
                  <p5>{selectedBlog.text}</p5>
                  <p1>{selectedBlog.category ? selectedBlog.category.name : 'N/A'}</p1>
                  <p2>
                    {Array.isArray(selectedBlog.tags) && selectedBlog.tags.length > 0
                      ? selectedBlog.tags.map(tag => tag.name).join(', ')
                      : 'No Tags'}
                  </p2>
                  <p3>{selectedBlog.status}</p3>
                  <p4>{formattedDate}</p4>
                </div></div>
              <div className='descr'>Description</div>
              <div
                style={{cursor:'pointer', fontSize:'15px'}}
                className='descript'
                onClick={() => setShowFullDescription(!showFullDescription)}
                dangerouslySetInnerHTML={{
                  __html: showFullDescription
                  ? selectedBlog.description || 'No Description Available'
                  : (selectedBlog.description?.slice(0, 650) || '') + ' ▪ ▪ ▪ ',
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Description Only Popup */}
      {showDescriptionPopup && selectedBlog && (
        <div className="description-only-popup-overlay"> {/* Add a new class for styling */}
          <div className="description-only-popup-content">
            <button
              className="close-description-popup-button"
              onClick={() => {
                setShowDescriptionPopup(false);
                setSelectedBlog(null); // Clear selected blog when closing
              }}
            >
              ×
            </button>
            <h3>{selectedBlog.text}</h3> {/* Blog Title */}
            <div
              dangerouslySetInnerHTML={{
                __html: selectedBlog.description || 'No Description Available'
              }}
              style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
