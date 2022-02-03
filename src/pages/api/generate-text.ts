const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  const response = await openai.createCompletion("text-curie-001", {
    prompt: "write a paragraph",
    temperature: 0.91,
    max_tokens: 450,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  response.data.choices[0].text.replace('—', '-')
  res.json({response: response.data.choices[0].text.replace(/\n/g, '')});
}