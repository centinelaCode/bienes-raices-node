

export const formularioLogin = (req, res) => {
  res.render('auth/login', {
    autenticado: false
  });
}