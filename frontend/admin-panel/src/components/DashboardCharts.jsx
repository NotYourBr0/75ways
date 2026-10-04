// src/components/DashboardCharts.jsx
import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import './DashboardCharts.css';
import { API_BASE_URL } from '../config/api';

// Helper constant for Pie Chart label positioning
const RADIAN = Math.PI / 180;

const DashboardCharts = () => {
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tagsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tags`),
          fetch(`${API_BASE_URL}/api/categories`),
        ]);

        if (!tagsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const tagsData = await tagsRes.json();
        const categoriesData = await categoriesRes.json();

        setTags(tagsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter out items with 0 postCount for cleaner charts
  const filteredTags = tags.filter(tag => tag.postCount > 0);
  const filteredCategories = categories.filter(category => category.postCount > 0);

  // A random color palette for the charts
  const COLORS_CATEGORIES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8A2BE2', '#20B2AA', '#FFD700'];

  // Custom label function for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return percent > 0.02 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  // Function to truncate long labels for Bar Chart
  const truncateLabel = (value) => {
    const maxLength = 15;
    if (value && value.length > maxLength) {
      return `${value.substring(0, maxLength)}...`;
    }
    return value;
  };

  if (loading) {
    return <p className="chart-loading-message">Loading charts...</p>;
  }

  if (error) {
    return <p className="chart-error-message">{error}</p>;
  }

  return (
    <div className="dashboard-grid-container">
      <div className="chart-item category-pie-chart">
        <h3 className="chart-title">Categories by Post Count</h3>
        {filteredCategories.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredCategories}
                dataKey="postCount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {filteredCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_CATEGORIES[index % COLORS_CATEGORIES.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data-message">No category data to display.</p>
        )}
      </div>

      <div className="chart-item tag-bar-chart">
        <h3 className="chart-title">Tags by Post Count</h3>
        {filteredTags.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredTags}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis dataKey="name" angle={-30} textAnchor="end" tickFormatter={truncateLabel} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="postCount" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data-message">No tag data to display.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;