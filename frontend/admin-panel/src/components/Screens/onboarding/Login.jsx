import React, { useState, useEffect, useContext } from 'react';
import '../../Styles/onboarding/Login.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../config/api';

function Login({ onSubmit }) {
  const navigate = useNavigate(); 
  const { login, user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const valueupdate = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const valueadd = async (e) => {
    e.preventDefault(); 

    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        
        //  Save token + user
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        login(data.user); //  call context login

        if (onSubmit) onSubmit();
        setFormData({ email: '', password: '' });

        // Go to dashboard and replace history (so back button won't return)
        navigate('/', { replace: true });
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <form className="login-form" onSubmit={valueadd}>
      <h2 className="form-heading">Login Page</h2>

      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={valueupdate}
        placeholder="Enter your e-mail"
        required
      />

      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={valueupdate}
        placeholder="Enter your password"
        required
      />

      <div className="form-buttons">
        <button type="submit" className="submit-btn">Submit</button>
      </div>
      
      <div className='regi'>
        <Link to='/Register'>Don't have an account? Click here</Link>
      </div>
    </form>
  );
}

export default Login;
