import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
// import "../App.css";

const ThankYou = () => {
  const location = useLocation(); // Use useLocation hook to access location
  const state = location.state; // Extract state from location

  // Add null check for state
  if (!state) {
    return (
      <div className="thank-you-container">
        <h2>Thank You for Your Payment!</h2>
        <p>We have received your payment. Thank you for choosing our service.</p>
      </div>
    );
  }

  const { selectedPlan, customerName, cardName } = state; // Destructure state

  return (
    <div className="thank-you-container">
      <h2>Thank You{customerName}, for Your Payment!</h2>
      <p>We have received your payment. Thank you for choosing our service.</p>
      {selectedPlan && (
        <div className="plan-details">
          <h3>Plan Details</h3>
          <p>Name: {selectedPlan.name}</p>
          <p>Price: ${selectedPlan.price}/month</p>
        </div>
      )}
      {cardName && (
        <div className="card-details">
          <h3>Card Details</h3>
          <p>Card Name: {cardName}</p>
        </div>
      )}
    </div>
  );
};

export default ThankYou;
