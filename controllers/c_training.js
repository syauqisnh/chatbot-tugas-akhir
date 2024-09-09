const db = require("../models");
const data_training = db.data_training;
const data_message = db.data_message;
const { v4: uuidv4 } = require("uuid");
const { manager, trainNLPModel } = require("../train-model");

const post_training = async (req, res) => {
  try {
    const { training_question } = req.body;
    const newChatId = uuidv4();

    if (!training_question) {
      return res.status(400).json({
        success: false,
        message: "Pertanyaan pelatihan diperlukan",
      });
    }

    const response = await manager.process("id", training_question);

    let training_answer = response.answer || "None";
    const intent = response.intent;

    if (training_answer === "None") {
      training_answer = "Maaf, saya belum mengerti maksud Anda. Mungkin Anda bisa tanyakan kepada admin.";
      await data_message.create({
        message_uuid: newChatId,
        message_question: training_question,
        message_answer: training_answer,
      });
      console.log("Jawaban 'None' telah disimpan ke database");
    } else {
      console.log("Jawaban tidak disimpan ke database karena sudah ada");
    }

    console.log("Jawaban ditemukan:", training_answer);
    console.log("Intent yang diproses:", intent);

    res.status(200).json({
      success: true,
      message: "Sukses Mendapat Balasan",
      training_answer: training_answer,
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat berinteraksi dengan message:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat berinteraksi dengan message",
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
      where: { training_uuid },
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
    const {
      limit = null,
      page = null,
      keyword = "",
      order = { training_id: "desc" },
    } = req.query;

    let offset = limit && page ? (page - 1) * limit : 0;
    const orderField = Object.keys(order)[0];
    const orderDirection =
      order[orderField]?.toLowerCase() === "asc" ? "ASC" : "DESC";

    const whereClause = {};
    if (keyword) {
      const keywordClause = {
        [Op.like]: `%${keyword}%`,
      };
      offset = 0;

      whereClause.training_intent = whereClause.training_intent
        ? { [Sequelize.Op.and]: [whereClause.training_intent, keywordClause] }
        : keywordClause;
    }

    const allTrainingData = await data_training.findAndCountAll({
      where: whereClause,
      limit: limit ? parseInt(limit) : null,
      offset: offset,
      order: [[orderField, orderDirection]],
    });

    const formattedData = allTrainingData.rows.map((trainingData) => {
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
      count: allTrainingData.count,
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
      where: { training_uuid },
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
