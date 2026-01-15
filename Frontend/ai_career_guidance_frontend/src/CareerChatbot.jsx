import { useState, useRef, useEffect } from "react";

function CareerChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        content: data.answer
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to AI service." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>AI Career Assistant</div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.role === "user"
                ? styles.userMessage
                : styles.aiMessage)
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, ...styles.aiMessage }}>
            Thinking...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputArea}>
        <textarea
          placeholder="Ask a career-related question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          rows={2}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "70%",
    height: "80vh",
    margin: "30px auto",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif"
  },
  header: {
    padding: "15px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5"
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#fafafa"
  },
  message: {
    maxWidth: "70%",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "12px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap"
  },
  userMessage: {
    backgroundColor: "#d1e7ff",
    alignSelf: "flex-end",
    marginLeft: "auto"
  },
  aiMessage: {
    backgroundColor: "#eaeaea",
    alignSelf: "flex-start",
    marginRight: "auto"
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#fff"
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none"
  },
  sendButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none"
  }
};

export default CareerChatbot;
