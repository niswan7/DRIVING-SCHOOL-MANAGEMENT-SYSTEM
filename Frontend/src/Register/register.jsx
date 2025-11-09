import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Calendar, MapPin, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';

function Register() {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Prepare data for backend API
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          role: 'student' // Default role for registration
        };

        const response = await apiRequest(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          body: JSON.stringify(userData)
        });

        if (response.success) {
          alert('Registration successful! Please login with your credentials.');
          navigate('/login');
        }
      } catch (error) {
        setApiError(error.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-overlay"></div>
      
      <div className="register-card">
        <div className="register-header">
          <UserCircle className="register-logo-icon" size={48} />
          <h2 className="register-title">Student Registration</h2>
          <p className="register-subtitle">Join DriveEasy and start your driving journey today</p>
        </div>

        {apiError && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {apiError}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  className={`register-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  className={`register-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  className={`register-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  className={`register-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <Calendar className="input-icon" size={20} />
              <input
                type="date"
                name="dateOfBirth"
                placeholder="Date of Birth *"
                className={`register-input ${errors.dateOfBirth ? 'error' : ''}`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
            </div>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h3 className="section-title">Address Information</h3>
            
            <div className="form-group">
              <MapPin className="input-icon" size={20} />
              <input
                type="text"
                name="address"
                placeholder="Street Address *"
                className={`register-input ${errors.address ? 'error' : ''}`}
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  className={`register-input ${errors.city ? 'error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  className={`register-input ${errors.state ? 'error' : ''}`}
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <span className="error-text">{errors.state}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code *"
                  className={`register-input ${errors.zipCode ? 'error' : ''}`}
                  value={formData.zipCode}
                  onChange={handleChange}
                />
                {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            
            <div className="form-group">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username *"
                className={`register-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Password *"
                className={`register-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="register-submit-btn" disabled={isLoading}>
            <UserCircle size={20} />
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">Already have an account?</p>
          <button onClick={() => navigate('/login')} className="login-link-btn">
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
