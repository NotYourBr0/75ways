import React, { useState, createContext, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { 
  FaUserTie, 
  FaPlusCircle, 
  FaListAlt, 
  FaAngleRight, 
  FaAngleDown,
  FaHome, 
  FaPencilAlt, 
  FaTags, 
  FaUser, 
  FaPhotoVideo, 
  FaLayerGroup, 
  FaConciergeBell, 
  FaQuestionCircle,
  FaBars,
  FaTimes,
  FaSearch
} from 'react-icons/fa';
import UserDropdown from '../Drop/UserDropdown';
import Footer from '../Drop/Footer';
import '../../Styles/Dashboard/homepage.css';

// --- SearchContext ---
export const SearchContext = createContext();

function Homepage() {
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Close sidebar on route change automatically
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)} 
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sideBar ${isSidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dash" className="sidebar-brand-link" onClick={() => setIsSidebarOpen(false)}>
            <img className="sidebar-logo" src="/dash1.png" alt="Admin Panel Logo" />
          </NavLink>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {/* Dashboard */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/dash" || location.pathname === "/" ? "active" : ""}`}
              onClick={() => handleNavClick('/dash')}
            >
              <NavLink to="/dash" className="nav-link-item">
                <FaHome className="nav-icon" />
                <span className="nav-label">Dashboard</span>
              </NavLink>
            </li>

            {/* Blog Posts */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/blog" ? "active" : ""}`}
              onClick={() => handleNavClick('/blog')}
            >
              <NavLink to="/blog" className="nav-link-item">
                <FaPencilAlt className="nav-icon" />
                <span className="nav-label">Blog Posts</span>
              </NavLink>
            </li>

            {/* Interviews Submenu */}
            <li className={`menu-item-wrapper dropdown-wrapper ${["/AddInterview", "/AllInterviews"].includes(location.pathname) ? "active" : ""}`}>
              <div 
                className="nav-link-item dropdown-toggle"
                onClick={() => {
                  setIsInterviewOpen(!isInterviewOpen);
                  setIsServicesOpen(false);
                }}
              >
                <div className="nav-link-left">
                  <FaUserTie className="nav-icon" />
                  <span className="nav-label">Interviews</span>
                </div>
                <span className="chevron-icon">
                  {isInterviewOpen ? <FaAngleDown /> : <FaAngleRight />}
                </span>
              </div>

              {isInterviewOpen && (
                <ul className="submenu-list">
                  <li 
                    className={`submenu-item ${location.pathname === "/AddInterview" ? "active" : ""}`}
                    onClick={() => handleNavClick('/AddInterview')}
                  >
                    <NavLink to="/AddInterview" className="subnav-link">
                      <FaPlusCircle className="subnav-icon" />
                      <span>Add Interview</span>
                    </NavLink>
                  </li>
                  <li 
                    className={`submenu-item ${location.pathname === "/AllInterviews" ? "active" : ""}`}
                    onClick={() => handleNavClick('/AllInterviews')}
                  >
                    <NavLink to="/AllInterviews" className="subnav-link">
                      <FaListAlt className="subnav-icon" />
                      <span>All Interviews</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Services Submenu */}
            <li className={`menu-item-wrapper dropdown-wrapper ${["/AddServices", "/AllServices", "/ServiceCategories"].includes(location.pathname) ? "active" : ""}`}>
              <div 
                className="nav-link-item dropdown-toggle"
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  setIsInterviewOpen(false);
                }}
              >
                <div className="nav-link-left">
                  <FaConciergeBell className="nav-icon" />
                  <span className="nav-label">Services</span>
                </div>
                <span className="chevron-icon">
                  {isServicesOpen ? <FaAngleDown /> : <FaAngleRight />}
                </span>
              </div>

              {isServicesOpen && (
                <ul className="submenu-list">
                  <li 
                    className={`submenu-item ${location.pathname === "/AddServices" ? "active" : ""}`}
                    onClick={() => handleNavClick('/AddServices')}
                  >
                    <NavLink to="/AddServices" className="subnav-link">
                      <FaPlusCircle className="subnav-icon" />
                      <span>Add Service</span>
                    </NavLink>
                  </li>
                  <li 
                    className={`submenu-item ${location.pathname === "/ServiceCategories" ? "active" : ""}`}
                    onClick={() => handleNavClick('/ServiceCategories')}
                  >
                    <NavLink to="/ServiceCategories" className="subnav-link">
                      <FaLayerGroup className="subnav-icon" />
                      <span>Service-Cat</span>
                    </NavLink>
                  </li>
                  <li 
                    className={`submenu-item ${location.pathname === "/AllServices" ? "active" : ""}`}
                    onClick={() => handleNavClick('/AllServices')}
                  >
                    <NavLink to="/AllServices" className="subnav-link">
                      <FaListAlt className="subnav-icon" />
                      <span>All Services</span>
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            {/* Categories */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/category" ? "active" : ""}`}
              onClick={() => handleNavClick('/category')}
            >
              <NavLink to="/category" className="nav-link-item">
                <FaLayerGroup className="nav-icon" />
                <span className="nav-label">Categories</span>
              </NavLink>
            </li>

            {/* Tags */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/tags" ? "active" : ""}`}
              onClick={() => handleNavClick('/tags')}
            >
              <NavLink to="/tags" className="nav-link-item">
                <FaTags className="nav-icon" />
                <span className="nav-label">Tags</span>
              </NavLink>
            </li>

            {/* Media */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/media" ? "active" : ""}`}
              onClick={() => handleNavClick('/media')}
            >
              <NavLink to="/media" className="nav-link-item">
                <FaPhotoVideo className="nav-icon" />
                <span className="nav-label">Media</span>
              </NavLink>
            </li>

            {/* FAQs */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/faqs" ? "active" : ""}`}
              onClick={() => handleNavClick('/faqs')}
            >
              <NavLink to="/faqs" className="nav-link-item">
                <FaQuestionCircle className="nav-icon" />
                <span className="nav-label">FAQs</span>
              </NavLink>
            </li>

            {/* Users */}
            <li 
              className={`menu-item-wrapper ${location.pathname === "/user" ? "active" : ""}`}
              onClick={() => handleNavClick('/user')}
            >
              <NavLink to="/user" className="nav-link-item">
                <FaUser className="nav-icon" />
                <span className="nav-label">Users</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="right-panel-wrapper">
        <header className="header-container">
          <div className="header-left">
            <button 
              className="menu-toggle-btn" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
            <NavLink to="/dash" className="header-mobile-brand">
              <img className="header-logo" src="/dash1.png" alt="Logo" />
            </NavLink>
          </div>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="header-actions">
            <UserDropdown />
          </div>
        </header>

        <main className="main-content">
          <SearchContext.Provider value={searchTerm}>
            <Outlet />
          </SearchContext.Provider>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Homepage;