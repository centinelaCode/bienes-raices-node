import jwt from 'jsonwebtoken'

export const generarJWT = datos => jwt.sign({id: datos.id},process.env.JWT_SECRET,{ expiresIn: '1d' })


export const generarId = () => Math.random().toString(32).substring(2) + Date.now().toString(32);




