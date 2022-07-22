import express from 'express';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import csrf from 'csurf';
import db from './config/db.js'

const app = express();
/*===========================
=> Habilitar lectura d eformularios
=============================*/
app.use(express.urlencoded({extended: true}))


/*===========================
=> Habilitar cookie -parser and CSFR
=============================*/
app.use(cookieParser());
app.use(csrf({cookie: true}))

/*===========================
=> Conexión a la DB
=============================*/
try {
  await db.authenticate();
  db.sync();
  console.log('Connection has been established successfully')
} catch (error) {
  console.log(error)
}


/*===========================
=> Habilitamos Template Engine: pug
=============================*/
app.set('view engine', 'pug')
app.set('views', './views')


/*===========================
=> carpeta publica: public
=============================*/
app.use(express.static('public'))



/*===========================
=> Routes
=============================*/
app.use('/auth', usuarioRoutes);


/*===========================
=> Port and Listen
=============================*/
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server run on port ${port}`)
});