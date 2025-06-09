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
    const { question } = JSON.parse(event.body);
    if (!question) { /* ... */ }

    // CATAT PERTANYAAN USER
    console.log(`User asks: "${question}"`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    // CATAT JAWABAN BOT
    console.log(`Bot replies: "${text}"`);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) { /* ... */ }
};
