import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.GEMINI_API_KEY; // لێرەدا کلیلەکە لە ژینگەی پارێزراودا دەخوێندرێتەوە
  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const { prompt, drugName, imageBase64, lang } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let contents = [prompt];
    if (drugName) contents.push(`Drug Name: ${drugName}`);
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: "image/jpeg"
        }
      });
    }

    const result = await model.generateContent(contents);
    const response = await result.response;

    return res.status(200).json({ text: response.text() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
