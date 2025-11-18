import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './Pages.css';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'pending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        console.error('User not found');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const userId = user._id || user.id;
      
      const API_BASE_URL = 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.STUDENT_PAYMENTS(userId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      console.log('Payment history response:', data);
      
      if (data.success) {
        const allPayments = data.data || [];
        setPayments(allPayments);
        setPendingPayments(allPayments.filter(p => p.status === 'pending'));
      } else {
        setError(data.message || 'Failed to fetch payment history');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError('Failed to fetch payment history');
      setLoading(false);
    }
  };

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const handlePayNow = async (paymentId) => {
    if (!confirm('Are you sure you want to mark this payment as completed?')) {
      return;
    }

    try {
      setProcessingPayment(paymentId);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const API_BASE_URL = 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PROCESS_PAYMENT(paymentId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentMethod: 'cash', // Can be enhanced with a modal to select method
          paidAt: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Payment processed successfully!');
        fetchPaymentHistory(); // Refresh the list
      } else {
        setError(data.message || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-cancelled';
      case 'refunded': return 'status-upcoming';
      default: return '';
    }
  };

  const generateReceipt = (payment) => {
    const receiptWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
          .receipt-header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .receipt-header h1 { margin: 0; color: #333; }
          .receipt-header p { margin: 5px 0; color: #666; }
          .receipt-details { margin: 30px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .receipt-row strong { color: #333; }
          .receipt-row span { color: #666; }
          .total-row { font-size: 1.3rem; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
          .receipt-footer { margin-top: 50px; text-align: center; color: #999; font-size: 0.9rem; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; }
          .status-completed { background: #d1fae5; color: #065f46; }
          @media print { .no-print { display: none; } }
          .print-btn { background: #ff8c00; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 20px 5px; }
          .print-btn:hover { background: #cc7000; }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button class="print-btn" onclick="window.print()">Print Receipt</button>
          <button class="print-btn" onclick="window.close()">Close</button>
        </div>
        <div class="receipt-header">
          <h1>PAYMENT RECEIPT</h1>
          <p>Driving School Management System</p>
          <p>Receipt #: ${payment._id.substring(0, 8).toUpperCase()}</p>
        </div>
        <div class="receipt-details">
          <div class="receipt-row">
            <strong>Payment Type:</strong>
            <span>${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</span>
          </div>
          ${payment.paymentMethod ? `
          <div class="receipt-row">
            <strong>Payment Method:</strong>
            <span>${payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}</span>
          </div>
          ` : ''}
          <div class="receipt-row">
            <strong>Payment Date:</strong>
            <span>${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="receipt-row">
            <strong>Status:</strong>
            <span class="status-badge status-completed">COMPLETED</span>
          </div>
          ${payment.description ? `
          <div class="receipt-row">
            <strong>Description:</strong>
            <span>${payment.description}</span>
          </div>
          ` : ''}
          ${payment.transactionId ? `
          <div class="receipt-row">
            <strong>Transaction ID:</strong>
            <span>${payment.transactionId}</span>
          </div>
          ` : ''}
          <div class="receipt-row total-row">
            <strong>Total Amount:</strong>
            <span>Rs. ${Number(payment.amount || 0).toFixed(2)}</span>
          </div>
        </div>
        <div class="receipt-footer">
          <p>Thank you for your payment!</p>
          <p>This is a computer-generated receipt.</p>
        </div>
      </body>
      </html>
    `;
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
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
        <h1>Payments</h1>
      </div>

      <div className="page-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="payment-summary">
          <div className="summary-card">
            <h3>Total Paid</h3>
            <p className="total-amount">Rs. {totalPaid.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Pending Amount</h3>
            <p className="total-amount pending">Rs. {pendingAmount.toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Total Transactions</h3>
            <p className="total-amount">{payments.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Payments ({pendingPayments.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Payment History
          </button>
        </div>

        {loading ? (
          <div className="empty-state-page">
            <p>Loading payments...</p>
          </div>
        ) : (
          <div className="list-container">
          {activeTab === 'pending' ? (
            // Pending Payments Tab
            pendingPayments.length > 0 ? (
              pendingPayments.map(payment => (
                <div key={payment._id} className="list-item pending-payment-item">
                  <div className="list-item-header">
                    <h3>Rs. {Number(payment.amount || 0).toFixed(2)}</h3>
                    <span className={`status-badge ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                  <div className="list-item-details">
                    {payment.description && (
                      <p><strong>Description:</strong> {payment.description}</p>
                    )}
                    <div className="detail-row">
                      <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span><strong>Type:</strong> {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</span>
                    </div>
                  </div>
                  <div className="list-item-actions">
                    <button
                      onClick={() => handlePayNow(payment._id)}
                      disabled={processingPayment === payment._id}
                      className="btn-primary"
                    >
                      {processingPayment === payment._id ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-page">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <p>No pending payments. You're all caught up!</p>
              </div>
            )
          ) : (
            // Payment History Tab
            payments.length > 0 ? (
              payments.map(payment => (
                <div key={payment._id} className="list-item">
                  <div className="list-item-header">
                    <h3>Rs. {Number(payment.amount || 0).toFixed(2)}</h3>
                    <span className={`status-badge ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                <div className="list-item-details">
                  {payment.description && (
                    <p><strong>Description:</strong> {payment.description}</p>
                  )}
                  <div className="detail-row">
                    <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Created: {new Date(payment.createdAt).toLocaleDateString()}</span>
                  </div>
                  {payment.paidAt && (
                    <div className="detail-row">
                      <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <span>Paid: {new Date(payment.paidAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {payment.paymentMethod && (
                    <div className="detail-row">
                      <svg className="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      <span>Method: {payment.paymentMethod}</span>
                    </div>
                  )}
                  {payment.transactionId && (
                    <div className="detail-row">
                      <span><strong>Transaction ID:</strong> {payment.transactionId}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span><strong>Type:</strong> {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</span>
                  </div>
                </div>
                {payment.status === 'completed' && (
                  <div className="list-item-actions">
                    <button
                      onClick={() => generateReceipt(payment)}
                      className="btn-receipt"
                    >
                      View Receipt
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state-page">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <p>No payment history found.</p>
            </div>
          )
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;