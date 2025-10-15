'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    projectId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Project is required"
        },
        notNull: {
          msg: "Project is required"
        }
      }
    },
    assignedId: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Member is required"
        },
        notNull: {
          msg: "Member is required"
        }
      }
    },
    title: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is required"
        },
        notNull: {
          msg: "Title is required"
        }
      }
    },
    description: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required"
        },
        notNull: {
          msg: "Description is required"
        }
      }
    },
    status: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Status is required"
        },
        notNull: {
          msg: "Status is required"
        }
      }
    },
    startDate: {
      type : DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Start date is required"
        },
        notNull: {
          msg: "Start date is required"
        }
      }
    },
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};