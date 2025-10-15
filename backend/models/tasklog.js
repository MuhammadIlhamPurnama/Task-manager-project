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
    task_id: DataTypes.NUMBER,
    action: DataTypes.STRING,
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TaskLog',
  });
  return TaskLog;
};