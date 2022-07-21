import nodemailer from 'nodemailer'

export const emailRegistro = async(datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { nombre, email, token} = datos;
  
  // Envia el Email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en Bines Raices', 
    text: 'Confirma tu cuenta en Bines Raices',
    html: `
      <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

      <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: <a href="">Confirmar Cuenta</a> </p>

      <p>Si tu no create esta cuenta puedes ignorar este correo</p>
    `
  })

}