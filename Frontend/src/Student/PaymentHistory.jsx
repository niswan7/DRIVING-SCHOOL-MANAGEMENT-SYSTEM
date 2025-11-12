import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/payments/history');
      // const data = await response.json();
      // setPayments(data);

      // Mock data
      setPayments([]);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Payment History</h1>
      </div>

      <div className="page-content">
        <div className="payment-summary">
          <div className="summary-card">
            <h3>Total Paid</h3>
            <p className="total-amount">Rs. {totalPaid.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Total Transactions</h3>
            <p className="total-amount">{payments.length}</p>
          </div>
        </div>

        <div className="list-container">
          {payments.length > 0 ? (
            payments.map(payment => (
              <div key={payment.id} className="list-item">
                <div className="list-item-header">
                  <h3>Rs. {payment.amount.toFixed(2)}</h3>
                  <span className={`status-badge status-${payment.status}`}>
                    {payment.status}
                  </span>
                </div>
                <div className="list-item-details">
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{payment.date}</span>
                  </div>
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Method: {payment.method}</span>
                  </div>
                  {payment.notes && (
                    <p className="payment-notes">{payment.notes}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-page">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <p>No payment history found.</p>
              <button className="btn btn-primary" onClick={() => navigate('/make-payment')}>
                Make Your First Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;