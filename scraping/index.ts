import { parse } from "node-html-parser";
import axios from "axios";
import Quiz from "../models/Quiz";
import Category from "../models/Category";
import { connect } from "mongoose";

connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

(async () => {
  const URL = "http://openquizzdb.org/listing.php";

  try {
    const htmlResponse = await axios.get(URL, {
      responseType: "arraybuffer",
    });
    const firstCategory = "ANIMAUX";

    const parsedHtmlNodes = parse(htmlResponse.data).querySelectorAll("");

    const categoryRecord = {};
    let currentCategory = "";
    let firstCategoryIsParsed = false;

    for (let node of parsedHtmlNodes) {
      // Getting titles in order to define current category for following parsed nodes
      if (node.rawTagName === "span") {
        const category = node.childNodes[0].rawText.replace(/&Eacute;/g, "É");
        if (category === firstCategory) {
          firstCategoryIsParsed = true;
        }
        if (firstCategoryIsParsed) {
          currentCategory = category;
          if (!categoryRecord[currentCategory]) {
            const newCategory = new Category({ name: currentCategory });
            await newCategory.save();
            categoryRecord[currentCategory] = newCategory._id;
            console.log(`Category "${currentCategory}" added to the database.`);
          }
        }
      }

      // Getting quiz data
      if (node.classNames.includes("myhref")) {
        const quizNumber = node.rawAttributes.onclick.slice(
          node.rawAttributes.onclick.indexOf("q") + 2,
          node.rawAttributes.onclick.length - 1,
        );
        const quizLink = `http://openquizzdb.org/download.php?id=${quizNumber}`;

        const quizResponse = await axios.get(quizLink);
        const JSONLink = parse(quizResponse.data)
          .querySelectorAll("a")
          .map((link) => link.rawAttributes.href)
          .filter((link) => link && link.endsWith(".json"))[0];

        const quiz = (await axios.get(JSONLink)).data;

        const inputQuiz = {
          quizNumber: 1,
          category: categoryRecord[currentCategory],
          theme: quiz["thème"].slice(0, quiz["thème"].indexOf("(") - 1),
          subTheme: quiz["thème"].slice(
            quiz["thème"].indexOf("(") + 1,
            quiz["thème"].indexOf(")"),
          ),
          difficulty: quiz["difficulté"][0],
          quizItems: {
            beginner: quiz.quizz.fr["débutant"].map((quizItem) => ({
              _id: quizItem.id,
              question: quizItem.question,
              choices: quizItem.propositions,
              answer: quizItem["réponse"],
              anecdote: quizItem.anecdote,
            })),
            intermediate: quiz.quizz.fr["confirmé"].map((quizItem) => ({
              _id: quizItem.id,
              question: quizItem.question,
              choices: quizItem.propositions,
              answer: quizItem["réponse"],
              anecdote: quizItem.anecdote,
            })),
            expert: quiz.quizz.fr["expert"].map((quizItem) => ({
              _id: quizItem.id,
              question: quizItem.question,
              choices: quizItem.propositions,
              answer: quizItem["réponse"],
              anecdote: quizItem.anecdote,
            })),
          },
        };

        const newQuiz = new Quiz(inputQuiz);
        await newQuiz.save();

        console.log(`Quiz "${newQuiz._id}" added to the database.`);
      }
    }
  } catch (error) {
    throw error;
  }

  process.exit();
})();
