import React, { useState } from 'react';
import { apiRequest } from '../utils/apiHelper';
import { API_ENDPOINTS } from '../config/api';
import { CreditCard, DollarSign } from 'lucide-react';

const PaymentModal = ({ studentId, onClose, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'card',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(API_ENDPOINTS.PAYMENTS, {
        method: 'POST',
        data: {
          studentId,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          paymentDate: new Date().toISOString(),
          status: 'pending',
          description: formData.description || 'Course payment'
        }
      });
      
      if (response.success) {
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label><DollarSign size={18} /> Amount (Rs.)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="form-group">
        <label><CreditCard size={18} /> Payment Method</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          required
        >
          <option value="card">Credit/Debit Card</option>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add payment notes (e.g., Course name, installment number)..."
          rows="3"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="modal-actions">
        <button type="button" onClick={onClose} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentModal;
