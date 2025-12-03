import React, { useState, useEffect } from 'react';
import { Car, Book, Calendar, Clock, Award, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api.js';
import './Courses.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api${API_ENDPOINTS.COURSES}`);
      const result = await response.json();
      
      // Extract courses from response data and filter only active courses
      const coursesData = result.data || [];
      const activeCourses = coursesData.filter(course => course.status === 'active');
      setCourses(activeCourses);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/login');
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'theory':
      case 'beginner':
        return <Book size={24} />;
      case 'practical':
      case 'intermediate':
        return <Car size={24} />;
      case 'advanced':
        return <Award size={24} />;
      default:
        return <Car size={24} />;
    }
  };

  return (
    <div className="courses-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <Car className="logo-icon" size={32} />
          <span className="logo-text">DriveEasy</span>
        </div>
        <div className="nav-title">
          DRIVING SCHOOL MANAGEMENT SYSTEM
        </div>
        <div className="nav-links">
          <div className="nav-link" onClick={() => navigate('/')}>Home</div>
          <div className="nav-link active">Courses</div>
          <a href="/login" className="nav-link login-btn">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="courses-hero">
        <div className="courses-hero-overlay"></div>
        <div className="courses-hero-content">
          <h1 className="courses-hero-title">Our Driving Courses</h1>
          <p className="courses-hero-description">
            Choose from our comprehensive range of driving courses designed to meet your needs
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <div className="courses-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="no-courses">
              <Car size={64} />
              <h3>No courses available at the moment</h3>
              <p>Please check back later for upcoming courses</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-icon">
                    {getCategoryIcon(course.type)}
                  </div>
                  <div className="course-category">{course.type || 'General'}</div>
                  <h3 className="course-name">{course.title || course.name}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-details">
                    <div className="course-detail">
                      <Clock size={18} />
                      <span>{course.duration} hours</span>
                    </div>
                    <div className="course-detail">
                      <Calendar size={18} />
                      <span>Flexible Schedule</span>
                    </div>
                  </div>

                  <div className="course-features">
                    <div className="course-feature">
                      <CheckCircle size={16} />
                      <span>Certified Instructors</span>
                    </div>
                    <div className="course-feature">
                      <CheckCircle size={16} />
                      <span>Modern Vehicles</span>
                    </div>
                    <div className="course-feature">
                      <CheckCircle size={16} />
                      <span>Practical Training</span>
                    </div>
                  </div>

                  <div className="course-footer">
                    <div className="course-price">
                      <span className="price-label">Price</span>
                      <span className="price-amount">${course.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="signup-section">
        <div className="signup-content">
          <h2>Ready to Start Your Driving Journey?</h2>
          <p>Sign up now and get access to our expert instructors and flexible scheduling</p>
          <button className="signup-btn" onClick={handleSignUp}>
            Sign Up Now
          </button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <div className="footer-logo">
              <Car size={28} />
              <span>DriveEasy</span>
            </div>
            <p className="footer-description">
              Your trusted partner in driving education. Building confident, safe drivers since 2010.
            </p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <div className="footer-link" onClick={() => scrollToSection('home')}>Home</div>
            <div className="footer-link" onClick={() => scrollToSection('about')}>About Us</div>
            <a href="/login" className="footer-link">Login</a>
            <a href="/courses" className="footer-link">Courses</a>
            <div className="footer-link" onClick={() => scrollToSection('contact')}>Contact</div>
          </div>
          <div className="footer-column">
            <h4>Services</h4>
            <a href="/courses" className="footer-link">Beginner Lessons</a>
            <a href="/courses" className="footer-link">Advanced Training</a>
            <a href="/courses" className="footer-link">Defensive Driving</a>
            <a href="/login" className="footer-link">Road Test Prep</a>
          </div>
          <div className="footer-column">
            <h4>Contact Info</h4>
            <p className="footer-info">
              <Phone size={16} /> +91 80780 06591
            </p>
            <p className="footer-info">
              <Mail size={16} /> info@driveeasy.com
            </p>
            <p className="footer-info">
              <MapPin size={16} /> 123 Driving Range Rd, Alappuzha
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Courses;
