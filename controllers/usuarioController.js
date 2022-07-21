

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