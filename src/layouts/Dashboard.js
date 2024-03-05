import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChartistGraph from "react-chartist";
import moment from 'moment';
import { Image } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Chart from "chart.js/auto"; // Import Chart.js library
import logoImg from 'assets/img/brand/increqimg.png';
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";




function Dashboard() {

  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [apiData, setApiData] = useState([]);

  const [subscriptions, setSubscriptions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [register, setRegister] = useState([]);
  const [subscriptionStats, setSubscriptionStats] = useState(null);
  useEffect(() => {
    fetchSubscriptions();
    fetchRegister();
  }, []);

  useEffect(() => {
    calculateSubscriptionStats(subscriptions);
  }, [subscriptions]);

  useEffect(() => {
    fetchData(); // Call fetchData when component mounts
  }, []);


  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=YOUR_API_KEY"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      // Extract relevant data for the chart
      const prices = Object.values(data["Time Series (5min)"]).map(
        (entry) => entry["4. close"]
      );
      setApiData(prices);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  };

  useEffect(() => {
    // Create a simple bar chart when apiData changes
    if (apiData.length > 0) {
      renderBarChart();
    }
  }, [apiData]);

  const renderBarChart = () => {
    const ctx = document.getElementById("barChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Array.from(Array(apiData.length).keys()), // Use numbers as labels
        datasets: [
          {
            label: "Closing Prices",
            data: apiData,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("http://localhost:3001/subscription");
      const data = await response.json();
      setSubscriptions(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };



  const fetchRegister = async () => {
    try {
      const response = await fetch("http://localhost:3001/register");
      const data = await response.json();
      setRegister(data)
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  const combinedSubscriptions = subscriptions.map((subscription, index) => {
    if (subscription.name === subscription.name && subscription.selectedPlan) {
      return {
        ...subscription,
        ...subscription.selectedPlan
      };
    } else {
      return subscription;
    }
  });


  const handleCancel = async (subscriptionId) => {
    try {
      const response = await fetch(`http://localhost:3001/subscription/${subscriptionId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Clear all items from the subscriptions list
        setSubscriptions([]);
        // Increment the cancel orders count for the canceled subscription in the register state
        setRegister(prevRegister => {
          const updatedRegister = [...prevRegister];
          const subscriptionIndex = updatedRegister.findIndex(item => item.id === subscriptionId);
          if (subscriptionIndex !== -1) {
            updatedRegister[subscriptionIndex] = {
              ...updatedRegister[subscriptionIndex],
              cancelOrders: (updatedRegister[subscriptionIndex].cancelOrders || 0) + 1
            };
          }
          return updatedRegister;
        });
        setLastUpdated(new Date()); // Update last updated time
      } else {
        console.error('Failed to delete subscription');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };




  const totalRevenue = subscriptions.reduce((total, subscription) => {
    return total + (subscription.selectedPlan ? subscription.selectedPlan.price : 0);
  }, 0);


  const totalCancelOrders = register.reduce((total, item) => {
    return total + (item.cancelOrders || 0);
  }, 0);



  const calculateSubscriptionStats = (data) => {
    const basicCount = data.filter(sub => sub.selectedPlan && sub.selectedPlan.planname === "Basic").length;
    const standardCount = data.filter(sub => sub.selectedPlan && sub.selectedPlan.planname === "Standard").length;
    const premiumCount = data.filter(sub => sub.selectedPlan && sub.selectedPlan.planname === "Premium").length;

    const totalSubscriptions = data.length;
    setSubscriptionStats({
      basic: (basicCount / totalSubscriptions) * 100,
      standard: (standardCount / totalSubscriptions) * 100,
      premium: (premiumCount / totalSubscriptions) * 100,
    });
  };
  console.log(combinedSubscriptions)

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];


  const handleBillingClick = () => {
    navigate('/billing-setup');
  };


  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Navbar.Brand href="#home">
            Scouts & Knives
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/billing-setup')}>Billing</Nav.Link> {/* Use navigate function */}
            <Nav.Link href="#pricing">Settings</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Number</p>
                      <Card.Title as="h4">150GB</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update Now
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <Card.Title as="h4">$ {totalRevenue.toFixed(2)}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-calendar-alt mr-1"></i>
                  Last updated: {lastUpdated ? lastUpdated.toLocaleString() : "N/A"}
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Cancel Orders</p>
                      <Card.Title as="h4">{totalCancelOrders}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock-o mr-1"></i>
                  In the last hour
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Customers</p>
                      <Card.Title as="h4">+{subscriptions.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-redo mr-1"></i>
                  Update now
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="8">
          <Card>
  <Card.Header>
    <Card.Title as="h4">Stock Performance</Card.Title>
    <p className="card-category">24 Hours Performance</p>
  </Card.Header>
  <Card.Body>
    {apiData.length > 0 && (
      <div className="ct-chart" id="chartStock">
        <ChartistGraph
          data={{
            labels: apiData.map((_, index) => index + 1), // Use numbers as labels
            series: [apiData.map(entry => parseFloat(entry) || 0)]
          }}
          type="Line"
          options={{
            low: Math.min(...apiData.map(entry => parseFloat(entry) || 0)),
            high: Math.max(...apiData.map(entry => parseFloat(entry) || 0)),
            showArea: false,
            height: "245px",
            axisX: {
              showGrid: false
            },
            lineSmooth: true,
            showLine: true,
            showPoint: true,
            fullWidth: true,
            chartPadding: {
              right: 50
            }
          }}
          responsiveOptions={[
            [
              "screen and (max-width: 640px)",
              {
                axisX: {
                  labelInterpolationFnc: function (value) {
                    return value[0];
                  }
                }
              }
            ]
          ]}
        />
      </div>
    )}
  </Card.Body>
  <Card.Footer>
    <div className="legend">
      <i className="fas fa-chart-line text-primary"></i> Stock Performance
    </div>
    <hr />
    <div className="stats">
      <i className="fas fa-history"></i> Updated {lastUpdated ? moment(lastUpdated).fromNow() : "N/A"}
    </div>
  </Card.Footer>
</Card>
          </Col>

          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Subscription Distribution</Card.Title>
                <p className="card-category">Percentage of Subscriptions</p>
              </Card.Header>
              <Card.Body>
                {subscriptionStats && (
                  <Pie
                    data={{
                      labels: [],
                      datasets: [{
                        data: [
                          subscriptionStats.basic,
                          subscriptionStats.standard,
                          subscriptionStats.premium
                        ],
                        backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB'],
                        hoverBackgroundColor: ['#FFCE56', '#FF6384', '#36A2EB']
                      }]
                    }}
                    options={{
                      legend: {
                        display: false
                      },

                      plugins: {
                        datalabels: {
                          formatter: (value, ctx) => {
                            let sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / sum) * 100).toFixed(2) + "%";
                            return percentage;
                          },
                          color: '#fff',
                          font: {
                            weight: 'bold'

                          },
                        },
                        textAlign: 'center',
                        labels: {
                          title: {
                            font: {
                              size: '16'
                            }
                          }
                        }
                      },

                      tooltips: {
                        enabled: false
                      },
                      hover: {
                        mode: null
                      }
                    }}
                  />
                )}
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-warning"></i> Basic {" "}
                  <i className="fas fa-circle text-danger"></i> Standard{" "}
                  <i className="fas fa-circle text-info"></i> Premium
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-history"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Subscription Plans</Card.Title>
                <p className="card-category">Revenue by Plan</p>
              </Card.Header>
              <Card.Body>
                <div className="ct-chart" id="chartActivity">
                  <ChartistGraph
                    data={{
                      labels: ["Basic", "Standard", "Premium"],
                      series: [
                        [
                          combinedSubscriptions.filter(subscription => subscription.selectedPlan && subscription.selectedPlan.planname === "Basic").length,
                        ],
                        [
                          combinedSubscriptions.filter(subscription => subscription.selectedPlan && subscription.selectedPlan.planname === "Standard").length,
                        ],
                        [
                          combinedSubscriptions.filter(subscription => subscription.selectedPlan && subscription.selectedPlan.planname === "Premium").length,
                        ],
                      ],
                    }}
                    type="Bar"
                    options={{
                      axisX: {
                        showGrid: false,
                      },
                      axisY: {
                        onlyInteger: true, // Ensure Y-axis values are integers
                      },
                      height: "245px",
                      classNames: {
                        bar: 'ct-bar', // Add a class to bars for styling
                      },
                      // Define colors for each series
                      seriesBarDistance: 10,
                      low: 0,
                      high: 10,
                    }}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <div className="legend">
                  <i className="fas fa-circle text-warning"></i> Basic {" "}
                  <i className="fas fa-circle text-danger"></i> Standard{" "}
                  <i className="fas fa-circle text-info"></i> Premium
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="fas fa-check"></i>
                  Data information certified
                </div>
              </Card.Footer>
            </Card>


          </Col>
          <Col md="6">
            <Card className="card-tasks">
              <Card.Header>
                <Card.Title as="h4">Customer Accounts</Card.Title>
                <p className="card-category">Backend development</p>
              </Card.Header>
              <Card.Body>
                <div className="table-full-width">
                  <table className="table">
                    <thead className="thead">
                      <tr>
                        <th>Cancel</th> {/* Change "Select" to "Cancel" */}
                        <th className="name">Name</th>
                        <th className="email">Email</th>
                        <th className="amount">Amount</th>
                        <th className="plan">Plan</th>
                      </tr>
                    </thead>
                    <tbody>

                      {subscriptions.map((subscription, index) => (
                        <tr key={index}>
                          <td>
                            {subscription.selectedPlan && (
                              <Button
                                variant="danger"
                                onClick={() => handleCancel(subscription.id)} // Pass subscription id to handleCancel
                              >
                                Cancel
                              </Button>
                            )}
                          </td>
                          <td>{subscription.name}</td>
                          <td>{subscription.email}</td>
                          <td>{subscription.selectedPlan ? subscription.selectedPlan.price : ''}</td>
                          <td>{subscription.selectedPlan ? subscription.selectedPlan.planname : ''}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <div className="stats">
                  <i className="now-ui-icons loader_refresh spin"></i>
                  Updated 3 minutes ago
                </div>
              </Card.Footer>
            </Card>
          </Col>

        </Row>
      </Container>

    </>
  );
}

export default Dashboard;
