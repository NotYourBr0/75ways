// src/components/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import DashboardSummary from '../../DashboardSummary';
import DashboardCharts from '../../DashboardCharts'; // Import the new component

function Dashboard() {
  const { user } = useContext(AuthContext);
  const username = user?.name || '';

  return (
    <div className="page-container">
      <div className="content-header">
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Dashboard</h2>
        {username && <span style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: 500 }}>Welcome, {username}</span>}
      </div>
      <DashboardSummary />
      {/* Render the dynamic charts here */}
      <DashboardCharts />
    </div>
  );
}

export default Dashboard;