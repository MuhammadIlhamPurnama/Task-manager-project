const { User } = require('../models')
const { signToken } = require('../helpers/jwt')
const { verifyPassword } = require('../helpers/bcrypt')

class UserController {
  static async register (req,res, next) {
    try {
      const {name, email, password} = req.body

      const result = await User.create({name, email, password})

      res.status(201).json({ message: 'User registered successfully', user: { id: result.id, name: result.name, email: result.email } })
    } catch (error) {
      next(error)
    }
  }

  static async login (req,res, next) {
    try {
      const {email, password} = req.body

      if (!email) {
        throw { name: 'BadRequest', message: 'Email is required' }
      }

      if (!password) {
        throw { name: 'BadRequest', message: 'Password is required' }
      }

      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw { name: 'Unauthorized', message: 'Invalid Email or Password' }
      }

      const isPasswordValid = verifyPassword(password, user.password)
      if (!isPasswordValid) {
        throw { name: 'Unauthorized', message: 'Invalid Email or Password' }
      }

      const access_token = signToken({ id: user.id, email: user.email })

      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController