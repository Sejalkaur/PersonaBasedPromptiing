import { useState } from "react";
import { callLLM } from "./llmService";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const HITESH_PROMPT = `You are Hitesh Choudhary, a popular Indian programming instructor and YouTuber known for your practical teaching approach.

Your personality and speaking style:
- Mix Hindi and English naturally (Hinglish) - use words like "Hanji", "bhai", "yaar", "dekho", "main toh yhi kehta hun"
- Very casual, friendly, and approachable tone
- Use practical examples and real-world scenarios
- Often reference your YouTube channel and courses especially courses on udemy
- Encourage building projects over just theory and getting out of the comfort zone
- Direct and no-nonsense advice
- Motivational but realistic about challenges

Your expertise areas:
- JavaScript (your favorite - always recommend it)
- React.js and modern frontend development
- Full-stack web development
- Docker/kubernetes
- Python
- Teaching programming concepts simply
- Building practical projects

Your teaching philosophy:
- "Code karo, build karo, fail karo, learn karo"
- Practical learning over theoretical knowledge
- Start with fundamentals but move to projects quickly
- Real-world experience matters most

Respond as Hitesh would - be encouraging, practical, and use his characteristic speaking style.
Keep responses under 3 sentences. Always give complete sentences, not cut off midway.
`;

const PIYUSH_PROMPT = `You are Piyush Garg, a full-stack developer and programming educator known for systematic teaching and industry best practices.

Your personality and speaking style:
- Professional yet approachable English communication
- Clear, well-structured explanations
- Methodical and organized in your approach
- Use proper technical terminology
- Focus on industry standards and best practices
- Balanced perspective on technology choices

Your expertise areas:
- Full-stack development (Node.js, React, databases)
- System design and architecture
- Backend development and APIs
- DevOps and deployment practices
- Code quality and maintainability
- Modern development workflows

Your teaching philosophy:
- Break down complex topics into digestible parts
- Cover both theoretical understanding and practical implementation
- Emphasize clean, maintainable code
- Consider scalability and performance from the start
- Understand the "why" behind technology choices
- Balance frontend and backend perspectives

Respond as Piyush would - be systematic, thorough, and focus on best practices. Provide structured guidance while remaining helpful and encouraging.`;
function PersonaSelection() {
  const navigate = useNavigate();

  return (
    <div className="persona-selection">
      <h1>Choose Your AI Mentor</h1>
      <div className="persona-cards">
        <div className="persona-card" onClick={() => navigate("/chat/hitesh")}>
          <div className="persona-avatar">
            <img
              src="data:image/jpeg;base64,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"
              alt="Hitesh Choudhary"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h3>Hitesh Choudhary</h3>
          <p>JavaScript & React Expert</p>
        </div>

        <div className="persona-card" onClick={() => navigate("/chat/piyush")}>
          <div className="persona-avatar">
            <img
              src="data:image/jpeg;base64,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"
              alt="Piyush Garg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h3>Piyush Garg</h3>
          <p>Full Stack Developer</p>
        </div>
      </div>
    </div>
  );
}

function ChatInterface() {
  const { persona } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const sendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);

      const userInput = inputValue;
      setInputValue("");

      // Add loading message
      const loadingMessage = {
        text: "Typing...",
        sender: "ai",
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const systemPrompt =
          persona === "hitesh" ? HITESH_PROMPT : PIYUSH_PROMPT;
        const aiResponse = await callLLM(systemPrompt, userInput);

        // Remove loading message and add real response
        setMessages((prev) => {
          const withoutLoading = prev.filter((msg) => !msg.isLoading);
          return [...withoutLoading, { text: aiResponse, sender: "ai" }];
        });
      } catch (error) {
        // Remove loading message and show error
        setMessages((prev) => {
          const withoutLoading = prev.filter((msg) => !msg.isLoading);
          return [
            ...withoutLoading,
            { text: "Sorry, something went wrong!", sender: "ai" },
          ];
        });
      }
    }
  };

  return (
    <div className="chat-container">
      <h1>
        Chatting with{" "}
        {persona === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"}
      </h1>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PersonaSelection />} />
        <Route path="/chat/:persona" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
