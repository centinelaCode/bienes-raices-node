import express from 'express';
import { formularioLogin } from '../controllers/usuarioController.js'

const router = express.Router();

/*===========================
Routes /auth
=============================*/
router.get('/login', formularioLogin)



export default router;