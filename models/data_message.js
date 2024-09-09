'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  data_message.init({
    message_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    message_uuid: DataTypes.STRING,
    message_question: DataTypes.STRING,
    message_answer: DataTypes.STRING,
    message_delete_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'data_message',
    tableName: 'data_message',
    timestamps: false,
  });
  return data_message;
};