"use strict";

const { v4: uuidv4 } = require("uuid");

const questionData = {
  "sayHallo": [
    "halo haloo",
    "helo heloo",
    "hallo halloo",
    "hello helloo",
    "hai",
    "hei",
    "hey heyy",
    "hay hayy",
    "bot",
    "tes",
    "hllo",
    "hlo",
    "helllo",
    "halllo",
    "heloo",
  ],
  "Pagi": ["selamt pagi", "slamat pagi"],
};

const answerData = {
  "sayHallo": [
    "Hai! Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?",
    "Halo! Selamat datang di aplikasi kami. Apakah ada yang ingin Anda tanyakan?",
  ],
  "Pagi": [
    "Selamat pagi! Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?",
    "Selamat pagi! Apakah ada yang ingin di tanyakan?",
  ],
  "None": [
    "Maaf, saya belum mengerti maksud Anda. Mungkin Anda bisa tanyakan kepada admin.",
  ],
};

module.exports = {
  async up(queryInterface, Sequelize) {
    const trainingData = [];

    for (const intent in questionData) {
      const questions = questionData[intent];
      const answers = answerData[intent] || [];

      trainingData.push({
        training_uuid: uuidv4(),
        training_intent: intent,
        training_question: JSON.stringify(questions),
        training_answer: JSON.stringify(answers),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    }

    await queryInterface.bulkInsert("data_training", trainingData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("data_training", null, {});
  },
};
