import express from 'express';
import { 
  formularioLogin, 
  formularioRegistro, 
  formularioOlvidePassword, 
  registrar,
  confirmarCuenta,
  resetPassword
} from '../controllers/usuarioController.js'

const router = express.Router();

/*===========================
Routes /auth
=============================*/
router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);
router.get('/confirmar/:token', confirmarCuenta);

router.get('/olvide-password', formularioOlvidePassword);
router.post('/olvide-password', resetPassword);



export default router;