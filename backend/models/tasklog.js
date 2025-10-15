'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TaskLog.init({
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Task is required"
        },
        notNull: {
          msg: "Task is required"
        }
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Action is required"
        },
        notNull: {
          msg: "Action is required"
        }
      }
    },
    note: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'TaskLog',
  });
  return TaskLog;
};