const bcrypt = require('bcryptjs')

const hashPassword = (pass) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(pass, salt)
}

const verifyPassword = (pass, hashedPass) => {
  return bcrypt.compareSync(pass, hashedPass)
}

module.exports = {
  hashPassword,
  verifyPassword
}