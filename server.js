const express = require('express');
const route = require('./routes/route');
const { trainNLPModel } = require('./train-model');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json()); // Middleware untuk menguraikan payload JSON

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Gunakan middleware CORS
app.use(cors({ 
  credentials: true,
  origin: 'http://localhost:5173' 
}));

app.use(route);

// Melatih model Node-NLP saat server dimulai
trainNLPModel();

app.listen(port, () => {
  console.log(`Server Running port ${port}`);
});
