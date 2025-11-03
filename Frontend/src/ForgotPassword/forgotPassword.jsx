import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './forgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace this with your actual API endpoint
      // Example API call:
      // const response = await fetch('http://your-backend-url/api/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate success
      // In production, check the response from your backend
      // if (response.ok) {
      //   setIsSuccess(true);
      // } else {
      //   throw new Error('Failed to send reset link');
      // }
      
      console.log('Password reset requested for:', email);
      setIsSuccess(true);
      
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to login
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-overlay"></div>
      
      <div className="forgot-password-card">
        {!isSuccess ? (
          <>
            <div className="forgot-password-header">
              <div className="icon-wrapper">
                <Mail className="header-icon" size={48} />
              </div>
              <h2 className="forgot-password-title">Forgot Password?</h2>
              <p className="forgot-password-subtitle">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className={`forgot-password-input ${error ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {error && <span className="error-text">{error}</span>}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <button 
              onClick={handleBackToLogin}
              className="back-to-login-btn"
            >
              <ArrowLeft size={18} />
              Back to Login
            </button>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon-wrapper">
              <CheckCircle className="success-icon" size={64} />
            </div>
            <h2 className="success-title">Check Your Email!</h2>
            <p className="success-text">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-subtext">
              Please check your inbox and click the link to reset your password. 
              The link will expire in 1 hour.
            </p>
            <button 
              onClick={handleBackToLogin}
              className="return-login-btn"
            >
              <ArrowLeft size={18} />
              Return to Login
            </button>
            <button 
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="resend-btn"
            >
              Didn't receive the email? Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
