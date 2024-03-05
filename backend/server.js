// Import necessary modules
const express = require('express');
const cors = require('cors');

// Create an instance of the Express application
const app = express();
const port = 3001;

// Enable CORS for all origins
app.use(cors({ origin: '*' }));
app.use(express.json());

let subscriptions = [];

// Define a route handler for fetching data from Alpha Vantage
app.get('/alphavantage', async (req, res) => {
  try {
    // Dynamically import node-fetch as an ES module
    const fetch = await import('node-fetch');
    
    // Fetch data from Alpha Vantage API
    const response = await fetch.default('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=7YM74L3057L9B92D');
    const data = await response.json();
    console.log(data)
    res.json(data); // Send the fetched data as a JSON response
  } catch (error) {
    console.error('Error fetching data from Alpha Vantage:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
  }
});

// Define a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!'); // Or any other response you want to send for the root URL
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
