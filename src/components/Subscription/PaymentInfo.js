import React from 'react';

const PaymentInfo = ({ creditCardInfo }) => {
  return (
    <div>
      <h2>Payment Confirmation</h2>
      <p>Card Number: {creditCardInfo.cardNumber}</p>
      <p>Expiration Date: {creditCardInfo.expirationDate}</p>
      <p>CVV: {creditCardInfo.cvv}</p>
      <p>Cardholder Name: {creditCardInfo.cardholderName}</p>
    </div>
  );
};


export default PaymentInfo;