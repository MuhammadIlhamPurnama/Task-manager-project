'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProjectMember.init({
    projectId: {
      type: DataTypes.NUMBER,
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
    memberId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Member is required"
        },
        notNull: {
          msg: "Member is required"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'ProjectMember',
  });
  return ProjectMember;
};