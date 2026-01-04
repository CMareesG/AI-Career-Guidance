import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function CareerChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* Typing animation + fade-in */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blink {
        0% { opacity: 0.2; }
        20% { opacity: 1; }
        100% { opacity: 0.2; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Unable to connect to server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.title}>✨ CareerGPT</div>
          <div style={styles.subtitle}>
            Your AI-Powered Career Companion
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={styles.messages}>
          {/* EMPTY STATE */}
          {messages.length === 0 && !loading && (
            <div style={styles.emptyState}>
              <h2 style={styles.emptyTitle}>
                🚀 Discover Your Career Path
              </h2>

              <p style={styles.emptySubtitle}>
                Not sure what to do next?
                <br />
                Tell us about your interests and strengths — we’ll help you
                explore the right career options.
              </p>

              <ul style={styles.emptyList}>
                <li>🎓 Career options after <b>10th, 12th, or Graduation</b></li>
                <li>🧭 Step-by-step <b>roadmaps</b> for different professions</li>
                <li>🛠️ Skills, qualifications, and <b>time required</b></li>
                <li>💼 Practical guidance based on <b>real career paths</b></li>
              </ul>

              <p style={styles.emptyFooter}>
                Start by asking something simple like:
                <br />
                <em>“What career options suit my skills?”</em>
              </p>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf:
                  msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.role === "user" ? "#2563eb" : "#262626"
              }}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          ))}

          {/* THINKING */}
          {loading && (
            <div style={styles.thinkingBubble}>
              <TypingDots />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div style={styles.inputWrapper}>
        <div style={styles.inputContainer}>
          <textarea
            ref={inputRef}
            value={input}
            disabled={loading}
            rows={1}
            placeholder={
              loading
                ? "AI is responding..."
                : "Ask anything about careers…"
            }
            style={styles.input}
            onChange={(e) => {
              if (loading) return;
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 160) + "px";
            }}
            onKeyDown={(e) => {
              if (loading) return;
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={styles.sendBtn}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

/* Typing dots */
function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "6px", fontSize: "22px" }}>
      <span style={dotStyle(0)}>.</span>
      <span style={dotStyle(0.2)}>.</span>
      <span style={dotStyle(0.4)}>.</span>
    </span>
  );
}

const dotStyle = (delay) => ({
  animation: "blink 1.4s infinite both",
  animationDelay: `${delay}s`
});

const styles = {
  page: {
    height: "100vh",
    backgroundColor: "#1b1b1b",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    fontFamily: "system-ui"
  },

  chatBox: {
    width: "1295px",
    flexGrow: 1,
    marginTop: "90px",
    backgroundColor: "#202020",
    borderRadius: "14px",
    border: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  header: {
    padding: "18px",
    textAlign: "center",
    borderBottom: "1px solid #333",
    background: "linear-gradient(180deg, #202020, #1b1b1b)"
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#b5b5b5"
  },

  messages: {
    flexGrow: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  message: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#eaeaea",
    lineHeight: "1.6"
  },

  thinkingBubble: {
    backgroundColor: "#262626",
    padding: "8px 12px",
    borderRadius: "10px",
    width: "fit-content",
    color: "#ccc"
  },

  /* EMPTY STATE */
  emptyState: {
    margin: "auto",
    textAlign: "center",
    maxWidth: "560px",
    padding: "24px",
    animation: "fadeIn 0.6s ease"
  },

  emptyTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "14px",
    background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  emptySubtitle: {
    fontSize: "17px",
    marginBottom: "22px",
    color: "#d1d5db",
    lineHeight: "1.6"
  },

  emptyList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "24px",
    lineHeight: "2",
    fontSize: "16px",
    color: "#e5e7eb"
  },

  emptyFooter: {
    fontSize: "15px",
    color: "#9ca3af",
    lineHeight: "1.6"
  },

  inputWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "18px",
    backgroundColor: "#1b1b1b"
  },

  inputContainer: {
    width: "1300px",
    display: "flex",
    alignItems: "flex-end",
    backgroundColor: "#242424",
    borderRadius: "24px",
    padding: "10px 14px",
    border: "1px solid #333"
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#eaeaea",
    padding: "14px 16px",
    fontSize: "16px",
    resize: "none",
    minHeight: "48px",
    maxHeight: "160px",
    overflowY: "auto"
  },

  sendBtn: {
    backgroundColor: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: "44px",
    height: "44px",
    cursor: "pointer",
    fontSize: "18px"
  }
};

export default CareerChatbot;
