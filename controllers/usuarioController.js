import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js';

export const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Seción'
  });
}

export const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear Cuenta'
  });
}

export const registrar = async(req, res) => {
  // validacion
  await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req);

  let resultado = validationResult(req)
  res.json(resultado.array());

  const usuario = await Usuario.create(req.body);
  res.json(usuario);
}

export const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices'
  });
}

