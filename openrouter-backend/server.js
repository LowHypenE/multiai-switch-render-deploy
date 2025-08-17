import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";  // ✅ import cors

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());  // ✅ allow all origins

app.get("/", (req, res) => {
  res.send("OpenRouter Backend is running! Use POST /ask to chat with the AI.");
});

app.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

