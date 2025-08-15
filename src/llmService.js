const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY; // Replace with your key

export async function callLLM(systemPrompt, userMessage) {
  console.log("Making API call with persona prompt...");

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Free model
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 80,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    return data.choices[0]?.message?.content || "Sorry, no response generated.";
  } catch (error) {
    console.error("LLM API Error:", error);
    return "Sorry, there was an error processing your request.";
  }
}
