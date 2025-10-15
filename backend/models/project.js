'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init({
    name: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull : {
          msg: "Name is required"
        },
        notEmpty: {
          msg: "Name is required"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull : {
          msg: "Description is required"
        },
        notEmpty: {
          msg: "Description is required"
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull : {
          msg: "Start date is required"
        },
        notEmpty: {
          msg: "Start date is required"
        }
      }
    },
    endDate: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      allowNull : false,
      validate: {
        notNull : {
          msg: "Status is required"
        },
        notEmpty: {
          msg: "Status is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};