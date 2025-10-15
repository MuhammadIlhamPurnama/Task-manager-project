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
    project_id: DataTypes.NUMBER,
    member_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'ProjectMember',
  });
  return ProjectMember;
};