// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/query', async (req, res) => {
  const { engine = 'gpt-4', prompt } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: engine,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    const text = response.data.choices[0].message.content;
    res.json({ engine, text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar la IA', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
