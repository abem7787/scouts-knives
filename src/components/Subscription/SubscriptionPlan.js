import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async (plan) => {
    if (plan) {
      console.log(`Subscribed to ${plan.name} plan.`);
      
      try {
        // Send a POST request to the server with the selected plan
        const response = await fetch('http://localhost:3001/subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ selectedPlan: plan })
        });

        if (response.ok) {
          console.log('Subscription processed successfully');
          navigate('/SubscriptionConfirmation', { state: { selectedPlan: plan }});
        } else {
          console.error('Subscription failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
      }
    } else {
      alert('Please select a subscription plan.');
    }
  };

  const plans = [
    { id: 1, planname: 'Basic', price: 9.99, features: ['Feature 1', 'Feature 2', 'Feature 3'] },
    { id: 2, planname: 'Standard', price: 19.99, features: ['All Basic features', 'Feature 4', 'Feature 5'] },
    { id: 3, planname: 'Premium', price: 29.99, features: ['All Standard features', 'Feature 6', 'Feature 7'] }
  ];

  return (
    <div className="subscription-container">
      <h2>Subscription Plans</h2>
      <div className="plans-container">
        {plans.map(plan => (
          <div key={plan.id} className={`plan ${selectedPlan === plan ? 'selected' : ''}`} onClick={() => handleSelectPlan(plan)}>
            <h3>{plan.planname}</h3>
            <p>${plan.price}/month</p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(plan)}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
