import React, { useState } from 'react'; // 1. Import useState
import { User, Lock, Car, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

function Login() {
  // 2. Create state to store username and password from input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 3. Create a function to handle form submission
  const handleLogin = (event) => {
    // Prevent the page from reloading on form submission
    event.preventDefault(); 
    
    // Check the credentials stored in the state
    if (username === "admin" && password === "12345") {
        navigate('/admin');
    } else if (username === "instructor" && password === "12345") {
        navigate('/instructor');
    } else if (username === "student" && password === "12345") {
        navigate('/Student');
    } else {
        alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-overlay"></div>
      
      <div className="login-card">
        <div className="login-header">
          <Car className="logo-icon" size={40} />
          <h2 className="login-title">DriveEasy Login</h2>
          <p className="login-subtitle">Access your Student, Instructor, or Admin portal</p>
        </div>

        {/* 4. Use the onSubmit event on the form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              id='username'
              placeholder="Username or Email" 
              className="login-input" 
              required
              // 5. Connect the input field to the state
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Lock className="input-icon" size={20} />
            <input 
              id='password'
              type="password" 
              placeholder="Password" 
              className="login-input" 
              required
              // 6. Connect the input field to the state
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* This button now correctly submits the form */}
          <button type="submit" className="login-submit-btn">
            <LogIn size={20} />
            Log In Securely
          </button>
        </form>

        <div className="login-footer-links" >
          <a href="/" className="footer-link back-btn">Back</a>
          <a href="/forgotpassword" className="footer-link">Forgot Password?</a>
          <a href="/register" className="footer-link"> Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;