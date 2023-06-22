import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX",
  });
});

let myMessages = [];
app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `${prompt}`,
    //   temperature: 0,
    //   max_tokens: 50,
    //   top_p: 1,
    //   frequency_penalty: 0.5,
    //   presence_penalty: 0,
    // });

    myMessages.push({ role: "user", content: `${prompt}` });
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: myMessages,
    });
    console.log(myMessages);
    console.log(completion.data.usage);
    let answer = completion.data.choices[0].message;
    res.status(200).send({
      bot: answer,
    });
    myMessages.push({ role: "assistant", content: answer.content });
    console.log(myMessages);
  } catch (error) {
    // console.log(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("Server is running in port http://localhost:5000")
);
