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
  await check('email').isEmail().withMessage('Ingresa un Email valido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de almenos 6 caracteres').run(req);
  await check('repetir_password').equals('password').withMessage('Los Password deben ser iguales').run(req);
  let resultado = validationResult(req);


  // return res.json(resultado.array())
  // verificar que resultado este vacio
  if(!resultado.isEmpty()) {
    // si resultado NO esta vacio queire decir que hay errores y se deben mostrar en la vista
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: resultado.array()
    });
  }

  
  const usuario = await Usuario.create(req.body);
    res.json(usuario);
  
}

export const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices'
  });
}

