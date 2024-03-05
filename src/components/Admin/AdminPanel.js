import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './App.css';


function AdminPanel() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Define a function to fetch transactions using Axios GET request
    const fetchTransactions = async () => {
      try {
        // Make a GET request to fetch transactions from the server
        const response = await axios.get('http://localhost:3001/subscription');

        // Update the state with the fetched transactions
        setTransactions(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    // Call the fetchTransactions function when the component mounts
    fetchTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const renderTransactions = () => {
    if (!Array.isArray(transactions)) {
      return null; // Or any other default content or loading indicator
    }
    console.log(transactions)
  
    return transactions.map(transaction => (
      <tr key={transaction.id}>
        <td>{transaction.customer}</td>
        <td>{transaction.date}</td>
        <td>${transaction.amount}</td>
      </tr>
    ));
  };
  

  return (
    <div className="App">
      <h1>Customer Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {renderTransactions()}
        </tbody>
      </table>
    </div>
  );
}


export default AdminPanel;