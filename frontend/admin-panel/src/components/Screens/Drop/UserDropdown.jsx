// src/components/Drop/UserDropdown.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaCog } from 'react-icons/fa';
import '../../Styles/Drop/UserDropdown.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { useReviews } from '../../../context/ReviewsContext'; // Import the new hook

function UserDropdown() {
 const [open, setOpen] = useState(false);
 const dropdownRef = useRef(null);
 const navigate = useNavigate();
 const { logout, user } = useContext(AuthContext); 
 
 // Use the shared state from the context
 const { unreadReviewsCount } = useReviews();

 const isLoggedIn = !!user;
 const username = user?.name || '';

 const toggleDropdown = () => setOpen(!open);

 const handleProfileClick = () => {
  if (isLoggedIn) {
   navigate('/profile');
  } else {
   toast.error('Need to login first');
  }
  setOpen(false);
 };

 const handleLogout = () => {
  logout();
  setOpen(false);
  navigate('/login', { replace: true }); 
 };

 const handleBellClick = () => {
  navigate('/reviews');
 };

 useEffect(() => {
  function handleClickOutside(event) {
   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setOpen(false);
   }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 return (
  <div className="user-dropdown-container">
   <div className="user-dropdown" ref={dropdownRef}>
    <div className="icon-container bell-icon-container" onClick={handleBellClick}>
     <FaBell className="bell" />
     {unreadReviewsCount > 0 && (
      <span className="bell-badge">
       {unreadReviewsCount}
      </span>
     )}
    </div>
    <div className="icon-container" onClick={toggleDropdown}>
     <FaCog className="cog" />
    </div>

    {open && (
     <div className="dropdown-menu">
      <ul>
       {isLoggedIn && <li className="user-info">Hello, {username.split(' ')[0]}</li>}
       <li onClick={handleProfileClick}>Profile</li>

       {!isLoggedIn ? (
        <>
         <li><Link to="/Login" className="dropdown-link">Login</Link></li>
         <li><Link to="/Register" className="dropdown-link">Sign Up</Link></li>
        </>
       ) : (
        <li onClick={handleLogout}>Logout</li>
       )}
      </ul>
     </div>
    )}
   </div>
  </div>
 );
}

export default UserDropdown;