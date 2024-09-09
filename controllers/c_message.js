const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const data_message = db.data_message;

const put_message = async (req, res) => {
  try {
    const { message_uuid } = req.params;
    const { message_question, message_answer } = req.body;

    const chatDetail = await data_message.findOne({ where: { message_uuid } });

    if (!chatDetail) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    await data_message.update(
      {
        message_question: message_question,
        message_answer: message_answer,
      },
      { where: { message_uuid } }
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

const delete_message = async (req, res) => {
  try {
    const { message_uuid } = req.params;

    const delete_message = await data_message.findOne({
      where: { message_uuid },
    });

    if (!delete_message) {
      return res.status(404).json({
        success: false,
        message: "Gagal menghapus data: Data tidak ditemukan",
        data: null,
      });
    }

    await delete_message.update({ message_delete_at: new Date() });

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

const get_detail_message = async (req, res) => {
  try {
    const { message_uuid } = req.params;

    const chatDetail = await data_message.findOne({
      where: { message_uuid, message_delete_at: null },
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

const get_all_message = async (req, res) => {
  try {
    const {
      limit = null,
      page = null,
      keyword = "",
      order = { message_id: "desc" },
    } = req.query;

    let offset = limit && page ? (page - 1) * limit : 0;
    const orderField = Object.keys(order)[0];
    const orderDirection =
      order[orderField]?.toLowerCase() === "asc" ? "ASC" : "DESC";

    const whereClause = {
      message_delete_at: null,
    };

    if (keyword) {
      const keywordClause = {
        [Sequelize.Op.like]: `%${keyword}%`,
      };
      offset = 0;

      whereClause.message_question = whereClause.message_question
        ? { [Sequelize.Op.and]: [whereClause.message_question, keywordClause] }
        : keywordClause;
    }

    const data = await data_message.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    });

    const totalPages = limit ? Math.ceil(data.count / (limit || 1)) : 1;

    const result = {
      success: true,
      message: "Sukses mendapatkan data",
      data: data.rows.map((message) => ({
        message_uuid: message.message_uuid,
        message_question: message.message_question,
        message_answer: message.message_answer,
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
    console.error("Terjadi kesalahan saat mengambil data message:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data message",
    });
  }
};

module.exports = {
  put_message,
  delete_message,
  get_detail_message,
  get_all_message,
};
