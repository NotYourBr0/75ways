// src/components/DashboardSummary.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaNewspaper, FaMicrophone, FaHandshake } from 'react-icons/fa';
import './DashboardSummary.css';

const DashboardSummary = () => {
    const [summary, setSummary] = useState({
        users: 0,
        blogs: 0,
        interviews: 0,
        services: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummaryData = async () => {
            try {
                // Assuming you have API endpoints for these counts
                const [usersRes, blogsRes, interviewsRes, servicesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/users/count'),
                    fetch('http://localhost:5000/api/blogs/count'),
                    fetch('http://localhost:5000/api/interviews/count'),
                    fetch('http://localhost:5000/api/services/count'),
                ]);

                const usersData = await usersRes.json();
                const blogsData = await blogsRes.json();
                const interviewsData = await interviewsRes.json();
                const servicesData = await servicesRes.json();

                setSummary({
                    users: usersData.count,
                    blogs: blogsData.count,
                    interviews: interviewsData.count,
                    services: servicesData.count
                });

            } catch (err) {
                console.error("Failed to fetch dashboard summary data:", err);
                // Set a default value or show an error
                setSummary({ users: 'N/A', blogs: 'N/A', interviews: 'N/A', services: 'N/A' });
            } finally {
                setLoading(false);
            }
        };

        fetchSummaryData();
    }, []);

    if (loading) {
        return <p className="summary-loading-message">Loading summary...</p>;
    }

    return (
        <div className="summary-cards-container">
            <div className="summary-card" style={{background:'#e5f1e5ff' }} >
                <FaUsers className="summary-icon" style={{ color: '#4CAF50' }} />
                <div className="summary-details">
                    <span className="summary-count">{summary.users}</span>
                    <span className="summary-label">Total Users</span>
                </div>
            </div>
            <div className="summary-card" style={{background:'#dbeaf7ff' }}>
                <FaNewspaper className="summary-icon" style={{ color: '#2196F3' }} />
                <div className="summary-details">
                    <span className="summary-count">{summary.blogs}</span>
                    <span className="summary-label">Blog Posts</span>
                </div>
            </div>
            <div className="summary-card" style={{background:'#fef2dfff' }}>
                <FaMicrophone className="summary-icon" style={{ color: '#FF9800' }} />
                <div className="summary-details">
                    <span className="summary-count">{summary.interviews}</span>
                    <span className="summary-label">Interviews</span>
                </div>
            </div>
            <div className="summary-card" style={{background:'#fbe3e2ff' }}>
                <FaHandshake className="summary-icon" style={{ color: '#f44336' }} />
                <div className="summary-details">
                    <span className="summary-count">{summary.services}</span>
                    <span className="summary-label">Services</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;