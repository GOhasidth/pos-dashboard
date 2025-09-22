// backend/server.js
const express = require('express');
const cors = require('cors');

const transactionsRouter = require('./routes/transactions');
const salesRouter        = require('./routes/sales');
const productsRouter     = require('./routes/products');

console.log(
  'types:',
  typeof transactionsRouter,
  typeof salesRouter,
  typeof productsRouter
);  // <--- paste here

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/transactions', transactionsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/products', productsRouter); // ok to keep even if empty for now

// Simple health check
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
