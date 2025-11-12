import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const Assessments = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/assessments');
      // const data = await response.json();
      // setAssessments(data);

      // Mock data
      setAssessments([
        {
          id: 1,
          skill: 'Steering Control',
          score: 0,
          maxScore: 100,
          lastAssessed: 'Not assessed yet',
          feedback: 'No assessment data available'
        },
        {
          id: 2,
          skill: 'Parking',
          score: 0,
          maxScore: 100,
          lastAssessed: 'Not assessed yet',
          feedback: 'No assessment data available'
        },
        {
          id: 3,
          skill: 'Traffic Rules',
          score: 0,
          maxScore: 100,
          lastAssessed: 'Not assessed yet',
          feedback: 'No assessment data available'
        },
        {
          id: 4,
          skill: 'Highway Driving',
          score: 0,
          maxScore: 100,
          lastAssessed: 'Not assessed yet',
          feedback: 'No assessment data available'
        }
      ]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Detailed Assessments</h1>
      </div>

      <div className="page-content">
        <div className="assessment-summary">
          <div className="summary-card">
            <h3>Overall Progress</h3>
            <div className="circular-progress">
              <div className="progress-value">0%</div>
            </div>
            <p>0 / 20 Hours Completed</p>
          </div>
        </div>

        <div className="list-container">
          <h2 className="section-title">Skill Assessments</h2>
          {assessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <h3>{assessment.skill}</h3>
                <span className="score" style={{ color: getScoreColor(assessment.score, assessment.maxScore) }}>
                  {assessment.score}/{assessment.maxScore}
                </span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${(assessment.score / assessment.maxScore) * 100}%`,
                    backgroundColor: getScoreColor(assessment.score, assessment.maxScore)
                  }}
                ></div>
              </div>
              <div className="assessment-details">
                <p className="last-assessed">Last Assessed: {assessment.lastAssessed}</p>
                <p className="feedback">{assessment.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessments;