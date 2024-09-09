const express = require('express');
const route = require('./routes/route');
const { trainNLPModel } = require('./train-model');
const cors = require('cors');

const app = express();
const port = 5800;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors({ 
  credentials: true,
  origin: 'http://localhost:5173' 
}));

app.use(route);

trainNLPModel();

app.listen(port, () => {
  console.log(`Server Running port ${port}`);
});
