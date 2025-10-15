const { verifyToken } = require("../helpers/jwt")
const {User} = require('../models')

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      throw {name: "Unauthorized", message: "Invalid Token"}
    }

    const rawToken = authorization.split(' ')
    const tokenType = rawToken[0]
    const tokenValue = rawToken[1]

    if (tokenType !== "Bearer" || !tokenValue) {
      throw {name: "Unauthorized", message: "Invalid Token"}
    } 

    const result = verifyToken(tokenValue)

    const user = await User.findByPk(result.id)

    if (!user) {
      throw  {name: "Unauthorized", message: "Invalid Token"}
    }

    req.user = {id : user.id}

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authentication