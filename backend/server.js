const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'prototype' directory
app.use(express.static(path.join(__dirname, '..', 'prototype')));

// Middleware to catch all other routes and serve the index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'prototype', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(err.status).end();
    }
  });
});

// Routes
const indexRouter = require('./routes/index');
app.use('/api', indexRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
