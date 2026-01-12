import React from 'react';

const PaymentStatus = ({ status, amount }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending':
        return {
          color: '#ffc107',
          text: 'Pending Payment',
          icon: '⏳'
        };
      case 'advance_paid':
        return {
          color: '#17a2b8',
          text: '25% Advance Paid',
          icon: '💰'
        };
      case 'work_completed':
        return {
          color: '#28a745',
          text: 'Work Completed',
          icon: '✅'
        };
      case 'final_paid':
        return {
          color: '#20c997',
          text: '75% Final Paid',
          icon: '💸'
        };
      case 'completed':
        return {
          color: '#6f42c1',
          text: 'Transaction Complete',
          icon: '🏆'
        };
      default:
        return {
          color: '#6c757d',
          text: 'Unknown',
          icon: '❓'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="payment-status" style={{ borderColor: config.color }}>
      <div className="status-icon" style={{ backgroundColor: config.color }}>
        {config.icon}
      </div>
      
      <div className="status-content">
        <h4 style={{ color: config.color }}>{config.text}</h4>
        {amount && (
          <p className="amount-display">
            Amount: <strong>₹{amount}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;