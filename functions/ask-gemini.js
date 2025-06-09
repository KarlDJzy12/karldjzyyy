// Kita perlu menginstall 'node-fetch' untuk Netlify Functions
// Netlify akan menginstalnya secara otomatis jika kita punya file package.json
// Tapi untuk Gemini API, kita bisa menggunakan fetch bawaan Node.js terbaru.

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ambil API Key dari Environment Variable yang aman di Netlify
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function (event, context) {
  // Hanya izinkan metode POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Ambil pertanyaan user dari body request
    const { question } = JSON.parse(event.body);
    if (!question) {
      return { statusCode: 400, body: "Question is required." };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response from AI." }),
    };
  }
};
