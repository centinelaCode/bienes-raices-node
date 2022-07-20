import express from 'express';
import { formularioLogin, formularioRegistro } from '../controllers/usuarioController.js'

const router = express.Router();

/*===========================
Routes /auth
=============================*/
router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);



export default router;