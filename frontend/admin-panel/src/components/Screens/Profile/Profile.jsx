import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import '../../Styles/Profile/Profile.css';

function Profile() {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const name = user?.name || 'Administrator';
  const email = user?.email || 'admin@example.com';

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-top-bar">
          <button 
            type="button" 
            className="profile-back-link" 
            onClick={() => navigate('/dash')}
            title="Return to Dashboard"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        <div className="profile-avatar">
          {initials}
        </div>

        <h2 className="profile-name">{name}</h2>
        <span className={`profile-badge ${isAdmin ? 'admin' : 'user'}`}>
          {isAdmin ? 'Administrator' : 'Standard User'}
        </span>

        <div className="profile-details">
          <div className="profile-detail-row">
            <span className="profile-detail-label">Full Name</span>
            <span className="profile-detail-value">{name}</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Email Address</span>
            <span className="profile-detail-value">{email}</span>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Account Role</span>
            <span className="profile-detail-value">{isAdmin ? 'Admin' : 'User'}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            type="button" 
            className="profile-home-btn" 
            onClick={() => navigate('/dash')}
          >
            Return to Home
          </button>
          <button 
            type="button" 
            className="profile-signout-btn" 
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
