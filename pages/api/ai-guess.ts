import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { drawing } = req.body;

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Analyze the following drawing and guess what it is: ${drawing}`,
        max_tokens: 100,
        temperature: 0.7,
      });

      const aiGuess = response.data.choices[0].text.trim();
      res.status(200).json({ guess: aiGuess });
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      res.status(500).json({ error: 'Error with OpenAI API' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
