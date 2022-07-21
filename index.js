import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

const app = express();
/*===========================
Conexión a la DB
=============================*/
try {
  await db.authenticate();
  console.log('Connection has been established successfully')
} catch (error) {
  console.log(error)
}


/*===========================
Habilitamos Template Engine: pug
=============================*/
app.set('view engine', 'pug')
app.set('views', './views')

/*===========================
carpeta publica: public
=============================*/
app.use(express.static('public'))


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