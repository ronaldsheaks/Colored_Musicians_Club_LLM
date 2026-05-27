import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

app.use(express.json({ limit: '5mb' }));
app.use(express.static('.'));

app.post('/api/analyze', async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt string.' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.' });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: 'You are a careful digital humanities research assistant. Extract only transcript-grounded claims. Mark uncertain transcript/caption names as Low or Medium confidence. Do not invent sources.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    res.json({ output: response.output_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Unknown server error.' });
  }
});

app.listen(port, () => {
  console.log(`CMC LLM app running at http://localhost:${port}`);
});
