import React, { useState } from 'react';
import { Car, Bike, Truck, CheckCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Courses.css';

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

function Courses() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Two Wheeler Only",
      icon: <Bike size={48} />,
      description: "Master the art of riding motorcycles and scooters with our comprehensive two-wheeler training program.",
      duration: "2-3 weeks",
      price: "₹5,000",
      features: [
        "Basic motorcycle controls and handling",
        "Traffic rules and road safety",
        "Defensive riding techniques",
        "License test preparation",
        "10 practical sessions",
        "Theory classes included"
      ],
      color: "blue"
    },
    {
      id: 2,
      title: "Four Wheeler Only",
      icon: <Car size={48} />,
      description: "Comprehensive car driving lessons from basics to advanced techniques for confident city and highway driving.",
      duration: "3-4 weeks",
      price: "₹8,000",
      features: [
        "Basic to advanced car driving",
        "Parking and maneuvering",
        "Highway driving experience",
        "Night driving sessions",
        "15 practical sessions",
        "Mock driving test"
      ],
      color: "green"
    },
    {
      id: 3,
      title: "Both Two & Four Wheeler",
      icon: <><Bike size={32} /><Car size={32} /></>,
      description: "Complete driving package covering both two-wheeler and four-wheeler vehicles for maximum flexibility.",
      duration: "5-6 weeks",
      price: "₹12,000",
      features: [
        "Complete motorcycle training",
        "Complete car driving training",
        "Combined theory sessions",
        "Traffic rules mastery",
        "25 practical sessions total",
        "Both license preparations",
        "Best value package"
      ],
      color: "purple"
    },
    {
      id: 4,
      title: "Heavy Vehicle License",
      icon: <Truck size={48} />,
      description: "Professional training for heavy vehicles including trucks, buses, and commercial vehicles.",
      duration: "6-8 weeks",
      price: "₹15,000",
      features: [
        "Heavy vehicle operation",
        "Commercial driving techniques",
        "Load management and safety",
        "Long-distance driving",
        "20 practical sessions",
        "Commercial license prep",
        "Advanced safety training"
      ],
      color: "orange"
    }
  ];

  const handleEnrollClick = (course) => {
    console.log('Enroll clicked for course:', course.title);
    setSelectedCourse(course);
    
    // Check if user is logged in
    const authenticated = isAuthenticated();
    console.log('Is authenticated:', authenticated);
    console.log('Token:', localStorage.getItem('token'));
    
    if (!authenticated) {
      // If not logged in, redirect to login page with course info
      console.log('Redirecting to Login page');
      navigate('/Login', { state: { selectedCourse: course, from: '/Courses' } });
    } else {
      // If logged in, navigate to registration or booking page
      console.log('Redirecting to Register page');
      navigate('/Register', { state: { selectedCourse: course } });
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="courses-page">
      {/* Navigation Bar */}
      <nav className="courses-navbar">
        <button className="back-button" onClick={goBack}>
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <div className="nav-logo">
          <Car className="logo-icon" size={28} />
          <span className="logo-text">DriveEasy</span>
        </div>
        <a href="/Login" className="login-link">Login</a>
      </nav>

      {/* Hero Section */}
      <div className="courses-hero">
        <div className="courses-hero-content">
          <h1 className="courses-hero-title">Our Driving Courses</h1>
          <p className="courses-hero-subtitle">
            Choose the perfect course for your driving journey. All courses include certified instructors, 
            modern vehicles, and flexible scheduling.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-container">
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className={`course-card course-${course.color}`}>
              <div className="course-icon">
                {course.icon}
              </div>
              <h2 className="course-title">{course.title}</h2>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <div className="course-meta-item">
                  <Clock size={20} />
                  <span>{course.duration}</span>
                </div>
                <div className="course-price">{course.price}</div>
              </div>

              <div className="course-features">
                <h3 className="features-title">What's Included:</h3>
                <ul className="features-list">
                  {course.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <CheckCircle size={18} className="feature-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className="enroll-button"
                onClick={() => handleEnrollClick(course)}
              >
                <Award size={20} />
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="courses-benefits">
        <h2 className="benefits-title">Why Choose DriveEasy?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <Award size={32} />
            <h3>Certified Instructors</h3>
            <p>All our instructors are certified and experienced professionals</p>
          </div>
          <div className="benefit-card">
            <Car size={32} />
            <h3>Modern Fleet</h3>
            <p>Well-maintained vehicles with dual controls and safety features</p>
          </div>
          <div className="benefit-card">
            <CheckCircle size={32} />
            <h3>High Success Rate</h3>
            <p>95% of our students pass their driving test on the first attempt</p>
          </div>
          <div className="benefit-card">
            <Clock size={32} />
            <h3>Flexible Timing</h3>
            <p>Schedule lessons at your convenience, including weekends</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="courses-footer">
        <p>&copy; {new Date().getFullYear()} DriveEasy Driving School. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/Login">Login</a>
          <a href="/Register">Register</a>
        </div>
      </footer>
    </div>
  );
}

export default Courses;
