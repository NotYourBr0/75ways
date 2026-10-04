import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/onboarding/Register.css';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/AuthContext';

function Register({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  //  Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const updateform = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetform = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Thanks ${formData.firstName}, your registration has been completed.`);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          password: '',
        });

        if (onSubmit) onSubmit();

        // Replace history so user can't go back to register
        navigate('/Login', { replace: true });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="register-form" onSubmit={resetform}>
      <h2>Sign Up Page</h2>

      <label>First Name:</label>
      <input type="text" name="firstName" value={formData.firstName} onChange={updateform} required />

      <label>Last Name:</label>
      <input type="text" name="lastName" value={formData.lastName} onChange={updateform} required />

      <label>Phone Number:</label>
      <input type="tel" name="phone" value={formData.phone} onChange={updateform} required />

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={updateform} required />

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={updateform} required />

      <div className="form-button">
        <button type="submit">Submit</button>
      </div>
    
      <div className='reg'>
        <Link to='/Login'>Already have an account? Click here</Link>
      </div>
    </form>
  );
}

export default Register;
