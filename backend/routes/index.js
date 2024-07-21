const express = require('express');
const path = require('path');
const router = express.Router();

// Example route that serves index.html
router.get('/index', (req, res) => {
  const indexPath = path.join(__dirname, '..', '..', 'prototype', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Failed to send index.html:", err);
      res.status(err.status).end();
    }
  });
});

// Example route that serves stats.js
router.get('/stats.js', (req, res) => {
  const statsPath = path.join(__dirname, '..', '..', 'prototype', 'stats.js');
  res.sendFile(statsPath, (err) => {
    if (err) {
      console.error("Failed to send stats.js:", err);
      res.status(err.status).end();
    }
  });
});

module.exports = router;
