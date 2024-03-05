import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Container, Row, Col } from "react-bootstrap";

function SubscriptionEdits() {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("http://localhost:3001/plans");
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md="12">
          <h1>Subscription Plans</h1>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.name}</td>
                  <td>{plan.price}</td>
                  <td>{plan.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default SubscriptionEdits;
