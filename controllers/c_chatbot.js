const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const chatbot = db.chatbot;

const put_chatbot = async (req, res) => {
  try {
    const { chatbot_uuid } = req.params;
    const { chatbot_question, chatbot_answer } = req.body;

    const chatDetail = await chatbot.findOne({ where: { chatbot_uuid } });

    if (!chatDetail) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    await chatbot.update(
      {
        chatbot_question: chatbot_question,
        chatbot_answer: chatbot_answer,
      },
      { where: { chatbot_uuid } }
    );

    res.status(200).json({
      success: true,
      message: "Data berhasil diperbarui",
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat memperbarui data:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memperbarui data",
    });
  }
};

const delete_chatbot = async (req, res) => {
  try {
    const { chatbot_uuid } = req.params;

    const delete_chatbot = await chatbot.findOne({
      where: { chatbot_uuid },
    });

    if (!delete_chatbot) {
      return res.status(404).json({
        success: false,
        message: "Gagal menghapus data: Data tidak ditemukan",
        data: null,
      });
    }

    await delete_chatbot.update({ deletedAt: new Date() });

    res.json({
      success: true,
      message: "Sukses menghapus data",
    });
  } catch (error) {
    console.log(error, "Data Error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

const get_detail_chatbot = async (req, res) => {
  try {
    const { chatbot_uuid } = req.params;

    const chatDetail = await chatbot.findOne({
      where: { chatbot_uuid, deletedAt: null },
    });

    if (!chatDetail) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: chatDetail,
    });
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat mengambil data dari database:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data dari database",
    });
  }
};

const get_all_chatbot = async (req, res) => {
  try {
    const {
      limit = null,
      page = null,
      keyword = "",
      order = { chatbot_id: "desc" },
    } = req.query;

    let offset = limit && page ? (page - 1) * limit : 0;
    const orderField = Object.keys(order)[0];
    const orderDirection =
      order[orderField]?.toLowerCase() === "asc" ? "ASC" : "DESC";

    const whereClause = {
      deletedAt: null,
    };

    if (keyword) {
      const keywordClause = {
        [Sequelize.Op.like]: `%${keyword}%`,
      };
      offset = 0;

      whereClause.chatbot_question = whereClause.chatbot_question
        ? { [Sequelize.Op.and]: [whereClause.chatbot_question, keywordClause] }
        : keywordClause;
    }

    const data = await chatbot.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    });

    const totalPages = limit ? Math.ceil(data.count / (limit || 1)) : 1;

    const result = {
      success: true,
      message: "Sukses mendapatkan data",
      data: data.rows.map((chatbot) => ({
        chatbot_uuid: chatbot.chatbot_uuid,
        chatbot_question: chatbot.chatbot_question,
        chatbot_answer: chatbot.chatbot_answer,
      })),
      pages: {
        total: data.count,
        per_page: limit ? parseInt(limit) : data.count,
        next_page:
          limit && page
            ? page < totalPages
              ? parseInt(page) + 1
              : null
            : null,
        to: limit ? offset + data.rows.length : data.count,
        last_page: totalPages,
        current_page: page ? parseInt(page) : 1,
        from: offset,
      },
    };

    if (data.count === 0) {
      return res.status(200).json({
        success: true,
        message: "Data Tidak Ditemukan",
        data: null,
        pages: {
          total: 0,
          per_page: limit ? parseInt(limit) : 0,
          next_page: null,
          to: 0,
          last_page: 0,
          current_page: page ? parseInt(page) : 1,
          from: 0,
        },
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data chatbot:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data chatbot",
    });
  }
};

module.exports = {
  put_chatbot,
  delete_chatbot,
  get_detail_chatbot,
  get_all_chatbot,
};
