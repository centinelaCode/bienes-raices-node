const express = require('express');

const app = express();

//routes
app.get('/', (req, res) => {
  res.send('Hola Mundo Express');
})

app.get('/nosotros', (req, res) => {
  res.send('Información de nosotros');
})

const port = 3001;
app.listen(port, () => {
  console.log(`Server run on port ${port}`)
});