"use strict";

const { v4: uuidv4 } = require("uuid");

const questionData = {
  sayHallo: [
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
  Pagi: ["selamt pagi", "slamat pagi"],
  Bertanya: ["Saya ingin bertanya?", "nanya?"],
  WebBuilder: [
    "apa itu web builder company profile",
    "apa itu website builder?",
    "apa itu website company profile?",
    "jelaskan web builder company profile",
    "jelaskan tentang web builder company profile",
    "apa itu company profile?",
    "apa itu website company profile?",
    "apa itu web company profile?",
    "web builder company profile",
    "Ini website tentang apa?",
  ],
};

const answerData = {
  sayHallo: [
    "Hai! Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?",
    "Halo! Selamat datang di aplikasi kami. Apakah ada yang ingin Anda tanyakan?",
  ],
  Pagi: [
    "Selamat pagi! Terima kasih telah menghubungi kami. Ada yang bisa saya bantu?",
    "Selamat pagi! Apakah ada yang ingin di tanyakan?",
  ],
  Bertanya: [
    "Silakan bertanya, ada yang bisa saya bantu?",
    "Tentu, silakan ajukan pertanyaan Anda.",
  ],
  WebBuilder: [
    "Web builder company profile adalah layanan yang menyediakan pembuatan dan perancangan situs web khusus untuk profil perusahaan. Layanan ini biasanya menawarkan berbagai fitur dan template yang dapat disesuaikan dengan kebutuhan dan identitas merek perusahaan. Tujuan utamanya adalah untuk menciptakan situs web yang menarik dan informatif yang dapat menggambarkan perusahaan dengan baik kepada pengunjung. Layanan ini mencakup desain, pengembangan, dan pengelolaan situs web serta integrasi dengan platform lain seperti media sosial."
  ],
  None: [
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
      });
    }

    await queryInterface.bulkInsert("data_training", trainingData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("data_training", null, {});
  },
};
