const { NlpManager } = require("node-nlp");
const db = require("./models");
const data_training = db.data_training;

const manager = new NlpManager({ languages: ["id"], forceNER: true });

const trainNLPModel = async () => {
  try {
    const trainingData = await data_training.findAll();

    trainingData.forEach(data => {
      const questions = JSON.parse(data.training_question);
      const answers = JSON.parse(data.training_answer);
      const intent = data.training_intent;

      console.log(`Menambahkan intent: ${intent}`);
      questions.forEach(question => {
        manager.addDocument('id', question, intent);
        console.log(`Menambahkan document: ${question} dengan intent: ${intent}`);
      });

      answers.forEach(answer => {
        manager.addAnswer('id', intent, answer);
        console.log(`Menambahkan answer: ${answer} untuk intent: ${intent}`);
      });
    });

    const noneResponses = await data_training.findAll({
      where: { training_intent: 'None' }
    });

    noneResponses.forEach(data => {
      const intent = 'None';
      const answers = JSON.parse(data.training_answer);

      answers.forEach(answer => {
        manager.addAnswer('id', intent, answer);
        console.log(`Menambahkan answer: ${answer} untuk intent: ${intent}`);
      });
    });

    await manager.train();
    manager.save();
    console.log("Model Node-nlp telah dilatih");
  } catch (error) {
    console.error("Error saat melatih model Node-nlp:", error);
  }
};


module.exports = { manager, trainNLPModel };
