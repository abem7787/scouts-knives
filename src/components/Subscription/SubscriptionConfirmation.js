import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubscriptionConfirmation = ({ setSelectedPlan }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlan } = location.state || {};

  const handleConfirm = () => {
    console.log(`Confirmed subscription to ${selectedPlan.planname} plan.`);
    setSelectedPlan(selectedPlan); // Set selectedPlan using the passed setSelectedPlan function
    navigate('/CheckoutPage');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="subscription-container">
      <h2>Subscription Confirmation</h2>
      <div className="plans-container">
        <div className="plan selected">
          {selectedPlan && (
            <>
              <h3>{selectedPlan.planname}</h3>
              <p>${selectedPlan.price}/month</p>
              <ul>
                {selectedPlan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleBack}>Back</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionConfirmation;
