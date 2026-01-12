import React, { useState } from 'react';

const PaymentTracker = ({ transactionId, initialStatus }) => {
  const [paymentStatus, setPaymentStatus] = useState(initialStatus || {
    advancePaid: false,
    workCompleted: false,
    finalPaid: false,
    rated: false
  });

  const handlePaymentAction = async (action) => {
    // Simulate API call
    console.log(`${action} for transaction ${transactionId}`);
    
    switch (action) {
      case 'markAdvancePaid':
        setPaymentStatus(prev => ({ ...prev, advancePaid: true }));
        break;
      case 'markWorkCompleted':
        setPaymentStatus(prev => ({ ...prev, workCompleted: true }));
        break;
      case 'markFinalPaid':
        setPaymentStatus(prev => ({ ...prev, finalPaid: true }));
        break;
      case 'markRated':
        setPaymentStatus(prev => ({ ...prev, rated: true }));
        break;
      default:
        break;
    }
  };

  const getProgressPercentage = () => {
    const steps = [paymentStatus.advancePaid, paymentStatus.workCompleted, paymentStatus.finalPaid];
    const completed = steps.filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const paymentSteps = [
    {
      id: 1,
      title: '25% Advance Paid',
      description: 'Buyer pays 25% to start work',
      status: paymentStatus.advancePaid,
      buyerAction: !paymentStatus.advancePaid ? 'Mark as Paid' : null,
      sellerAction: paymentStatus.advancePaid ? 'Confirm Received' : null
    },
    {
      id: 2,
      title: 'Work Completed',
      description: 'Seller delivers the completed work',
      status: paymentStatus.workCompleted,
      buyerAction: null,
      sellerAction: !paymentStatus.workCompleted ? 'Mark as Completed' : null
    },
    {
      id: 3,
      title: '75% Final Payment',
      description: 'Buyer pays remaining 75%',
      status: paymentStatus.finalPaid,
      buyerAction: !paymentStatus.finalPaid ? 'Mark as Paid' : null,
      sellerAction: paymentStatus.finalPaid ? 'Confirm Received' : null
    },
    {
      id: 4,
      title: 'Rating & Review',
      description: 'Both parties rate each other',
      status: paymentStatus.rated,
      buyerAction: !paymentStatus.rated ? 'Rate Seller' : null,
      sellerAction: !paymentStatus.rated ? 'Rate Buyer' : null
    }
  ];

  return (
    <div className="payment-tracker">
      <div className="payment-header">
        <h3>Payment Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {getProgressPercentage()}% Complete
        </p>
      </div>

      <div className="payment-steps">
        {paymentSteps.map(step => (
          <div 
            key={step.id} 
            className={`payment-step ${step.status ? 'completed' : ''}`}
          >
            <div className="step-indicator">
              <div className="step-number">{step.id}</div>
              <div className="step-line"></div>
            </div>
            
            <div className="step-content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              
              <div className="step-actions">
                {step.buyerAction && (
                  <button 
                    className="btn btn-sm btn-action"
                    onClick={() => handlePaymentAction(`mark${step.title.replace(' ', '')}`)}
                  >
                    {step.buyerAction}
                  </button>
                )}
                
                {step.sellerAction && (
                  <button 
                    className="btn btn-sm btn-action"
                    onClick={() => handlePaymentAction(`mark${step.title.replace(' ', '')}`)}
                  >
                    {step.sellerAction}
                  </button>
                )}
                
                {step.status && (
                  <span className="status-completed">✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-summary">
        <h4>Payment Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span>Total Amount:</span>
            <strong>₹1,000</strong>
          </div>
          <div className="summary-item">
            <span>Advance (25%):</span>
            <strong className={paymentStatus.advancePaid ? 'paid' : 'pending'}>
              {paymentStatus.advancePaid ? '✓ Paid ₹250' : 'Pending ₹250'}
            </strong>
          </div>
          <div className="summary-item">
            <span>Final (75%):</span>
            <strong className={paymentStatus.finalPaid ? 'paid' : 'pending'}>
              {paymentStatus.finalPaid ? '✓ Paid ₹750' : 'Pending ₹750'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;