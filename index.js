const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

// create a server object:
app.get('/signin', (req, res) => {
  const data = { ok: true };
  res.send({ data });
});

app.listen(80, async () => {
  console.log('http://localhost');
});
