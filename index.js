import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express();

/*===========================
Habilitamos Template Engine: pug
=============================*/
app.set('view engine', 'pug')
app.set('views', './views')



/*===========================
Routes
=============================*/
app.use('/auth', usuarioRoutes);


/*===========================
Port and Listen
=============================*/
const port = 3001;
app.listen(port, () => {
  console.log(`Server run on port ${port}`)
});