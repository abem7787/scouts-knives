import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import "App.css";

const CheckoutPage = ({ selectedPlan, customerName }) => {
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardholderName: ''
  });

  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const paymentData = {
        creditCardInfo: creditCardInfo,
        selectedPlan: selectedPlan,
        customerName: customerName
      };
  
      const response = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
  
      if (response.ok) {
        console.log('Payment successful!');
        navigate('/ThankYou', { state: { selectedPlan, customerName }});
      } else {
        console.error('Payment failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred during payment:', error);
    }
  };

  const handleBack = () => {
    navigate('/confirmation');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreditCardInfo({ ...creditCardInfo, [name]: value });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="selected-plan">
        <h3>{selectedPlan ? selectedPlan.name : ''}</h3>
        <p>${selectedPlan ? selectedPlan.price : ''}/month</p>
      </div>
      <div className="credit-card-form">
        <label htmlFor="cardNumber">Card Number:</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={creditCardInfo.cardNumber}
          onChange={handleChange}
        />

        <label htmlFor="expirationDate">Expiration Date:</label>
        <input
          type="text"
          id="expirationDate"
          name="expirationDate"
          value={creditCardInfo.expirationDate}
          onChange={handleChange}
        />

        <label htmlFor="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          value={creditCardInfo.cvv}
          onChange={handleChange}
        />

        <label htmlFor="cardholderName">Cardholder Name:</label>
        <input
          type="text"
          id="cardholderName"
          name="cardholderName"
          value={creditCardInfo.cardholderName}
          onChange={handleChange}
        />
      </div>
      <button onClick={handlePayment}>Pay Now</button>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default CheckoutPage;
