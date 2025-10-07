import React from 'react';
import { Car, Phone, Mail, MapPin, Award, Users, Calendar, Clock } from 'lucide-react';
import './home.css';

function HOME() {
  
  // Function for smooth scroll
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo" onClick={() => scrollToSection('home')}>
          <Car className="logo-icon" size={32} />
          <span className="logo-text">DriveEasy</span>
        </div>
        <div className="nav-title">
          DRIVING SCHOOL MANAGEMENT SYSTEM
        </div>
        <div className="nav-links">
          <div className="nav-link active" onClick={() => scrollToSection('home')}>Home</div>
          <div className="nav-link" onClick={() => scrollToSection('about')}>About</div>
          <div className="nav-link" onClick={() => scrollToSection('contact')}>Contact</div>
          <a href="/login" className="nav-link login-btn">Login</a>
        </div>
      </nav>

      <div className="hero-section-home" id="home">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title-main">
            Learn to Drive with Confidence
          </h1>
          <p className="hero-description">
            Professional driving instruction with certified instructors. Start your journey to becoming a safe and confident driver today.
          </p>
          <div className="hero-buttons">
            <a href="/login" className="cta-primary">Book a Lesson</a>
            <a href="/courses" className="cta-secondary">View Courses</a>
          </div>
        </div>
        <div className="hero-image-grid">
          <div className="hero-card">
            <Award size={40} />
            <h3>Certified Instructors</h3>
            <p>Learn from the best</p>
          </div>
          <div className="hero-card">
            <Users size={40} />
            <h3>5000+ Students</h3>
            <p>Successfully trained</p>
          </div>
          <div className="hero-card">
            <Calendar size={40} />
            <h3>Flexible Schedule</h3>
            <p>Learn at your pace</p>
          </div>
          <div className="hero-card">
            <Clock size={40} />
            <h3>Quick Learning</h3>
            <p>Fast track options</p>
          </div>
        </div>
      </div>

      <div className="about-section" id="about">
        <div className="section-container">
          <div className="section-badge">About Us</div>
          <h2 className="section-heading">Why Choose Our Driving School?</h2>
          <p className="section-subheading">
            We provide comprehensive driving education with a focus on safety, confidence, and skill development.
          </p>
          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon blue">
                <Award size={32} />
              </div>
              <h3>Professional Training</h3>
              <p>Our certified instructors bring years of experience and use proven teaching methods to ensure you become a safe, confident driver.</p>
            </div>
            <div className="about-card">
              <div className="about-icon green">
                <Car size={32} />
              </div>
              <h3>Modern Fleet</h3>
              <p>Learn in well-maintained, modern vehicles equipped with dual controls and the latest safety features for your peace of mind.</p>
            </div>
            <div className="about-card">
              <div className="about-icon orange">
                <Users size={32} />
              </div>
              <h3>Personalized Approach</h3>
              <p>We tailor our lessons to your individual learning style and pace, ensuring you get the most out of every session.</p>
            </div>
            <div className="about-card">
              <div className="about-icon purple">
                <Calendar size={32} />
              </div>
              <h3>Flexible Scheduling</h3>
              <p>Book lessons that fit your lifestyle with our convenient scheduling system. Weekend and evening slots available.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-section" id="contact">
        <div className="section-container">
          <div className="section-badge">Get In Touch</div>
          <h2 className="section-heading">Contact Us</h2>
          <p className="section-subheading">
            Ready to start your driving journey? Get in touch with us today.
          </p>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={28} />
              </div>
              <h3>Phone</h3>
              <p>+91 12345 67890</p>
              <p>Mon-Sat: 8AM - 8PM</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={28} />
              </div>
              <h3>Email</h3>
              <p>info@driveeasy.com</p>
              <p>support@driveeasy.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={28} />
              </div>
              <h3>Location</h3>
              <p>123 Driving Range Rd</p>
              <p>New Delhi, 110001</p>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <form className="contact-form">
              <div className="form-row">
                <input type="text" placeholder="Your Name" className="form-input" required />
                <input type="email" placeholder="Your Email" className="form-input" required />
              </div>
              <div className="form-row">
                <input type="tel" placeholder="Phone Number" className="form-input" />
                <input type="text" placeholder="Subject" className="form-input" required/>
              </div>
              <textarea placeholder="Your Message" className="form-textarea" rows={5} required></textarea>
              <button type="submit" className="form-submit">Send Message</button>
            </form>
          </div>
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
              <Phone size={16} /> +91 12345 67890
            </p>
            <p className="footer-info">
              <Mail size={16} /> info@driveeasy.com
            </p>
            <p className="footer-info">
              <MapPin size={16} /> 123 Driving Range Rd, New Delhi
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DriveEasy Driving School. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HOME;