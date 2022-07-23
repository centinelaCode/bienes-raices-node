import { DataTypes } from 'sequelize' 
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Usuario = db.define('usuarios',{
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email :{
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: DataTypes.STRING,
  confirmado: DataTypes.BOOLEAN
}, {
  hooks: {
    // hashea el password antes de guardarlo en la DB
    beforeCreate: async function(usuario) {
      const salt = await bcrypt.genSalt(10)
      usuario.password = await bcrypt.hash(usuario.password, salt);
    }
  }
})

// Method Personalizado de sequilize
Usuario.prototype.verificarPassword = function (password_user){
  return bcrypt.compareSync(password_user, this.password);
}

export default Usuario;