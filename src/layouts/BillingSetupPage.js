import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function BillingSetupPage() {
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send routingNumber and accountNumber to backend for processing
    // You can use fetch or any other method to send data to the server
    console.log('Routing Number:', routingNumber);
    console.log('Account Number:', accountNumber);
    // Optionally, you can navigate to another page after successful submission
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2>Billing Setup</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="routingNumber">
              <Form.Label>Routing Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter routing number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="accountNumber">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      {/* Additional functionalities */}
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2>Additional Functionalities</h2>
          {/* Insert buttons or links for additional functionalities */}
          <Button variant="secondary" className="mr-3">View Current Subscription Plans</Button>
          <Button variant="secondary" className="mr-3">Upgrade or Downgrade Subscription Plans</Button>
          <Button variant="secondary" className="mr-3">Cancel or Pause Subscriptions</Button>
          <Button variant="secondary" className="mr-3">View Billing History</Button>
          <Button variant="secondary" className="mr-3">Manage Payment Methods</Button>
          <Button variant="secondary" className="mr-3">Auto-Renewal Settings</Button>
          <Button variant="secondary" className="mr-3">Notification Preferences</Button>
          <Button variant="secondary" className="mr-3">Payment Settings</Button>
          <Button variant="secondary" className="mr-3">Billing Contacts</Button>
          <Button variant="secondary" className="mr-3">Support and Help</Button>
          <Button variant="secondary" className="mr-3">Security Settings</Button>
          <Button variant="secondary" className="mr-3">Feedback and Suggestions</Button>
          <Button variant="secondary" className="mr-3">Account Closure</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default BillingSetupPage;
