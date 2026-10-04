import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../../Styles/Media/Media.css'; 
import { SearchContext } from '../Dashboard/homepage';
import { API_BASE_URL } from '../../../config/api';

function Media() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTerm = useContext(SearchContext);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/blogs`);
        setMedia(response.data);
      } catch (err) {
        if (err.response) {
          setError(`HTTP error! status: ${err.response.status} - ${err.response.data.message || err.message}`);
        } else if (err.request) {
          setError('Network error: No response from server.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = media.filter(item => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const imageFilename = item.image ? item.image.toLowerCase() : '';
    const blogTitle = item.text ? item.text.toLowerCase() : '';
    const blogDescription = item.description ? item.description.toLowerCase() : '';
    const categoryName = item.category && item.category.name ? item.category.name.toLowerCase() : '';
    const tagNames = Array.isArray(item.tags) ? item.tags.map(tag => tag.name.toLowerCase()).join(' ') : '';

    return (
      imageFilename.includes(lowerCaseSearchTerm) ||
      blogTitle.includes(lowerCaseSearchTerm) ||
      blogDescription.includes(lowerCaseSearchTerm) ||
      categoryName.includes(lowerCaseSearchTerm) ||
      tagNames.includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return <div>Loading media...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="media-container">
      <div className="user">
        <h5 style={{ marginBottom: "10px" }}>Media</h5>
      </div>

      <div className="media-grid-wrapper"> {/* New wrapper for the grid */}
        {filteredMedia.length === 0 ? (
          <div className="no-media-found">No media found.</div>
        ) : (
          <div className="media-grid-collection"> {/* This will be your 3-column grid */}
            {filteredMedia.map((item, index) => (
              <div key={item._id || index} className="media-card">
                <img
                  src={item.image}
                  alt={item.altText || `Media ${index + 1}`}
                  className="media-image-item" // Class for individual images
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/CCCCCC/000000?text=No+Image"; }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Media;