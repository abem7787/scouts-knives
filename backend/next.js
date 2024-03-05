const sql = require('mssql');

// Configuration object for connecting to SQL Server
const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'http://localhost:3000', // You can use 'localhost\\instance' to connect to named instance
    database: 'Subscription',
    options: {
        encrypt: true // If you're on Windows Azure, you will need this
    }
};

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        console.error('Error connecting to SQL Server:', err);
        return;
    }
    
    console.log('Connected to SQL Server.');

    // Perform queries, etc. here
    
    // Close the connection when done
    sql.close();
});

// Example: executing a query
const executeQuery = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM File Tables');
        console.log(result.recordset);
    } catch (error) {
        console.error('Error executing query:', error);
    }
};

executeQuery();
