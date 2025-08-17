import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
  res.send("OpenRouter Backend is running! Use POST /ask to chat with the AI.");
});

// AI chat route
app.post("/ask", async (req, res) => {
  try {
    const { message, model } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
