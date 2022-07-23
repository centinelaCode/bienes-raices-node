import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generarId } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

/*===========================
=> Controller para mostrar el formulario Login
=============================*/
export const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Seción',
    csrfToken: req.csrfToken()
  });
}



/*===========================
=> Controller para autenticar
=============================*/
export const autenticar = async(req, res) => {
  // Validación
  await check('email').isEmail().withMessage('El Email es obligatorio').run(req);
  await check('password').notEmpty().withMessage('El Password es obligatorio').run(req);

  let resultado = validationResult(req);

  // verificar que resultado este vacio  
  if(!resultado.isEmpty()) {
    // si resultado NO esta vacio queire decir que hay errores y se deben mostrar en la vista
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: resultado.array()      
    });
  }

  const { email, password } = req.body;
  // comprobra que el usurio exista
  const usuario =  await Usuario.findOne({ where: {email}})

  if(!usuario) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El usuario no existe'}]    
    });
  }

  // verificar si el usuario esta confirmado
  if(!usuario.confirmado){
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'Tu cuenta no ha sido confirmada'}]    
    });
  }

  // Verificamos que el password sea correcto
  if(!usuario.verificarPassword(password)){
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El Password es incorrecto'}]    
    });
  }

  // Autenticar al usuario (paso todas las validaciones)
  const tokenJWT = jwt.sign({
    nombre: 'raul',
    empresa: 'El Siglo de Durango',
    tecnologias: 'NodeJS'
  },"palabrasupersecreta", {
    expiresIn: '1d'
  });
  // console.log(tokenJWT);

  




}






/*===========================
=> Controller para mostrar el formulario Registro
=============================*/
export const formularioRegistro = (req, res) => {
  // console.log(req.csrfToken());

  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
    csrfToken: req.csrfToken()
  });
}


/*===========================
=> Controller para cuando creamos un registro
=============================*/
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
      csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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


/*===========================
=> Controller para mostrar vista confirmar cuenta (avisa que s eha enviado un email)
=============================*/
export const confirmarCuenta = async(req, res, next) => {
  const { token } = req.params;
  // console.log(token);

  // verificar que el token sea valido
  const usuario = await Usuario.findOne({ where: {token}})
  console.log(usuario);

  // verificar la cuenta 
  if(!usuario) {
    return res.render('auth/confirmar-cuenta',{
      pagina: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
      error: true
    })
  }

  // Confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render('auth/confirmar-cuenta',{
    pagina: 'Cuenta Confirmada ',
    mensaje: 'La cuenta se confirmo Correctamente',    
  })  
  // console.log(usuario)
}



/*===========================
=> Controller para mostrar formulario olvidepassword
=============================*/
export const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices',
    csrfToken: req.csrfToken(),
  });
}



/*===========================
=> Controller para resetear el password (es el post donde enviamos el email)
=============================*/
export const resetPassword = async(req, res) => {
  // validacion  
  await check('email').isEmail().withMessage('Ingresa un Email valido').run(req);  
  
  let resultado = validationResult(req);
  // return res.json(resultado.array())

  // verificar que resultado este vacio  
  if(!resultado.isEmpty()) {
    // si resultado NO esta vacio queire decir que hay errores y se deben mostrar en la vista
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errores: resultado.array()      
    });
  }

  // buscar e usuario (email)
  const {email} = req.body;
  const usuario = await Usuario.findOne({where: {email}})
  // console.log(usuario)

  if(!usuario) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a Bienes Raices',
      csrfToken: req.csrfToken(),
      errores: [{msg: 'El Email no esta registrado'}]     
    });
  }

  // Como el usuario si existe se debe: generar un token y enviar un email
  usuario.token = generarId();
  await usuario.save();

  // Enviar email
  emailOlvidePassword({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token
  })


  // renderizar mensaje con las indicaciones que revise su correo
  res.render('templates/mensaje', {
    pagina: 'Restablece tu Password',
    mensaje: 'Hemos Enviado un Email con las instrucciones, presiona en el enlace'
  });  
}


/*===========================
=> Controller para comprobar token cuando se hace reset al password
=============================*/
export const comprobarToken = async(req, res) => {
  const { token } = req.params;
  // console.log(token);

  // verificar que el token sea valido
  const usuario = await Usuario.findOne({ where: {token}})
  // console.log(usuario);

  // verificar la cuenta 
  if(!usuario) {
    return res.render('auth/confirmar-cuenta',{
      pagina: 'Restablece tu Password',
      mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
      error: true
    })
  }

  // se muestra el form para que ingrese el nuevo password
  res.render('auth/reset-password', {
    pagina: 'Reestablece tu Password',
    csrfToken: req.csrfToken(),
  })


  // resete Token
  // usuario.token = null;
  // await usuario.save();
  
}


/*===========================
=> Controller para guardar el nuevo password en la DB
=============================*/
export const nuevoPassword = async(req, res) => {
  // validamos el password
  await check('password').isLength({ min: 6 }).withMessage('El Password debe ser de almenos 6 caracteres').run(req);

  // se capturan los errores
  let resultado = validationResult(req);

  // verificar que resultado este vacio  
  if(!resultado.isEmpty()) {
    // si resultado NO esta vacio queire decir que hay errores y se deben mostrar en la vista
    return res.render('auth/reset-password', {
      pagina: 'Restablece tu Password',
      csrfToken: req.csrfToken(),
      errores: resultado.array()      
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  // identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: {token}})

  // hashear el nuevo password  
  const salt = await bcrypt.genSalt(10)
  usuario.password = await bcrypt.hash(password, salt);

  // resete Token
  usuario.token = null;
  await usuario.save();

  // renderisamos una vista para decir que se reseteo correctamente
  res.render('auth/confirmar-cuenta',{
    pagina: 'Password Restablecido',
    mensaje: 'Els Password se guardo correctamente'
  })
}


