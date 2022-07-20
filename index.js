import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express();

/*===========================
Routes
=============================*/
app.use('/', usuarioRoutes);


/*===========================
Port and Listen
=============================*/
const port = 3001;
app.listen(port, () => {
  console.log(`Server run on port ${port}`)
});