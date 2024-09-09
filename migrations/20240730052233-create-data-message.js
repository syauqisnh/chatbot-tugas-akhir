'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data_message', {
      message_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_uuid: {
        type: Sequelize.STRING
      },
      message_question: {
        type: Sequelize.STRING
      },
      message_answer: {
        type: Sequelize.STRING
      },
      message_create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      message_update_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      message_delete_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      timestamps: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('data_message');
  }
};

