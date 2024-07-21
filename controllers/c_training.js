const db = require("../models");
const data_training = db.data_training;
const { v4: uuidv4 } = require("uuid");
const { manager, trainNLPModel } = require("../train-model");

const post_training = async (req, res) => {
  try {
    const { training_question } = req.body;

    if (!training_question) {
      return res.status(400).json({
        success: false,
        message: "Pertanyaan pelatihan diperlukan",
      });
    }

    const response = await manager.process("id", training_question);

    console.log("Jawaban ditemukan:", response.answer);
    console.log("Intent yang diproses:", response.intent); // Tambahkan log ini

    res.status(200).json({
      success: true,
      message: "Sukses Mendapat Balasan",
      training_answer: response.answer || "Jawaban tidak ditemukan",
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat berinteraksi dengan chatbot:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat berinteraksi dengan chatbot",
    });
  }
};

const post_training_admin = async (req, res) => {
  try {
    const { intent, questions, answers } = req.body;

    if (!intent || !questions || !answers) {
      return res.status(400).json({
        success: false,
        message: "Intent, pertanyaan, dan jawaban diperlukan",
      });
    }

    const questionsArray = questions.split("|").map((q) => q.trim());
    const answersArray = answers.split("|").map((a) => a.trim());

    const newTrainingData = {
      training_uuid: uuidv4(),
      training_intent: intent,
      training_question: JSON.stringify(questionsArray),
      training_answer: JSON.stringify(answersArray),
    };

    await data_training.create(newTrainingData);

    await trainNLPModel();

    res.status(201).json({
      success: true,
      message: "Data pelatihan ditambahkan dan model berhasil dilatih ulang",
      data: newTrainingData,
    });
  } catch (error) {
    console.error("Error menambahkan data pelatihan:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server internal",
    });
  }
};

const put_training = async (req, res) => {
  try {
    const { training_uuid } = req.params;
    const { intent, questions, answers } = req.body;

    if (!intent || !questions || !answers) {
      return res.status(400).json({
        success: false,
        message: "Intent, pertanyaan, dan jawaban diperlukan",
      });
    }

    const trainingData = await data_training.findOne({
      where: { training_uuid, deletedAt: null },
    });

    if (!trainingData) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
      });
    }

    const questionsArray = questions.split("|").map((q) => q.trim());
    const answersArray = answers.split("|").map((a) => a.trim());

    const updatedTrainingData = {
      training_intent: intent,
      training_question: JSON.stringify(questionsArray),
      training_answer: JSON.stringify(answersArray),
    };

    await data_training.update(updatedTrainingData, {
      where: { training_uuid },
    });

    await trainNLPModel();

    res.status(200).json({
      success: true,
      message: "Data pelatihan berhasil diperbarui dan model dilatih ulang",
      data: updatedTrainingData,
    });
  } catch (error) {
    console.error("Error memperbarui data pelatihan:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server internal",
    });
  }
};

const delete_training = async (req, res) => {
  try {
    const { training_uuid } = req.params;

    const deleteResult = await data_training.destroy({
      where: { training_uuid }
    });

    if (deleteResult === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: "Data pelatihan berhasil dihapus"
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat menghapus data pelatihan:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server internal"
    });
  }
};


const get_all_training = async (req, res) => {
  try {
    const allTrainingData = await data_training.findAll();

    const formattedData = allTrainingData.map(trainingData => {
      const questionsArray = JSON.parse(trainingData.training_question);
      const answersArray = JSON.parse(trainingData.training_answer);

      const questionsString = questionsArray.join("|");
      const answersString = answersArray.join("|");

      return {
        ...trainingData.dataValues,
        training_question: questionsString,
        training_answer: answersString,
      };
    });

    res.status(200).json({
      success: true,
      message: "Data pelatihan berhasil diambil",
      data: formattedData,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data pelatihan:", error);
    res.status(500).json({
      success: false,
      message: "Kesalahan server internal",
    });
  }
};

const get_detail_training = async (req, res) => {
  try {
    const { training_uuid } = req.params;
    const trainingData = await data_training.findOne({
      where: { training_uuid, deletedAt: null },
    });

    if (!trainingData) {
      return res.status(404).json({
        success: false,
        message: "Data pelatihan tidak ditemukan",
      });
    }

    // Parse JSON strings to arrays
    const questionsArray = JSON.parse(trainingData.training_question);
    const answersArray = JSON.parse(trainingData.training_answer);

    // Convert arrays back to strings using '|' as delimiter
    const questionsString = questionsArray.join("|");
    const answersString = answersArray.join("|");

    res.status(200).json({
      success: true,
      message: "Data pelatihan berhasil diambil",
      data: {
        ...trainingData.dataValues,
        training_question: questionsString,
        training_answer: answersString,
      },
    });
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat mengambil detail data pelatihan:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Kesalahan server internal",
    });
  }
};

module.exports = {
  post_training,
  post_training_admin,
  put_training,
  delete_training,
  get_all_training,
  get_detail_training,
};
