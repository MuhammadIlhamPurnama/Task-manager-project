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
      ProjectMember.belongsTo(models.Project, { foreignKey: 'projectId' })
      ProjectMember.belongsTo(models.Member, { foreignKey: 'memberId' })
    }
  }
  ProjectMember.init({
    projectId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
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