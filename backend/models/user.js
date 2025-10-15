'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists"
      },
      validate: {
        notNull: {
          msg: "Email required"
        },
        notEmpty: {
          msg: "Email required"
        },
        isEmail : {
          args: true,
          msg: "Email format is wrong"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required"
        }, 
        notNull: {
          msg: "Password is required"
        },
        len: {
          args: [5, 100], // panjang minimum 5 karakter, maksimal 100
          msg: "Password minimal 5 karakter"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required"
        }, 
        notNull: {
          msg: "Name is required"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};