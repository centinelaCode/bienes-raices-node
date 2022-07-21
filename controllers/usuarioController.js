import { check, validationResult } from 'express-validator'
import { generarId } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js';
import { emailRegistro } from '../helpers/emails.js'

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

  const { nombre, email, password } = req.body;

  // validacion
  await check('nombre').notEmpty().withMessage('El nombre es requerido').run(req);
  await check('email').isEmail().withMessage('Ingresa un Email valido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de almenos 6 caracteres').run(req);
  // await check('repetir_password').not().equals('password').withMessage('Los Password deben ser iguales').run(req);
  let resultado = validationResult(req);

  // return res.json(resultado.array())

  // verificar que resultado este vacio  
  if(!resultado.isEmpty()) {
    // si resultado NO esta vacio queire decir que hay errores y se deben mostrar en la vista
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }

  // verificar que usuario no esta duplicado (email)
  const existeUsuario = await Usuario.findOne({ where: { email }})
  if(existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: [{msg: 'El usuario ya esta registrado'}],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email
      }
    });
  }
  // console.log(existeUsuario)

  // alamacena un usuario
  const usuario = await Usuario.create({
    nombre, 
    email,
    password,
    token: generarId()
  });

  // envia email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })

  // mostrar mensaje de confimacion
  res.render('templates/mensaje', {
    pagina: 'Cuenta Creada Correctamente',
    mensaje: 'Hemos Enviado un Email de Confirmaicón, presiona en el enlace'
  });
    
  
}

export const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices'
  });
}

