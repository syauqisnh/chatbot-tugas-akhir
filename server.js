const express = require('express');
const route = require('./routes/route');
const { trainNLPModel } = require('./train-model');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors({ 
  credentials: true,
  origin: process.env.FRONTEND_URL
}));

app.use(route);

trainNLPModel();

app.listen(port, () => {
  console.log(`Server Running port ${port}`);
});
