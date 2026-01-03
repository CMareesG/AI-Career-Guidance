import { useState } from "react";

function CareerChatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question
        })
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Error connecting to AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>AI Career Assistant</h2>

      <textarea
        placeholder="Ask a career-related question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={askQuestion} style={styles.button}>
        Ask
      </button>

      {loading && <p>Thinking...</p>}

      {answer && (
        <div style={styles.answerBox}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "60%",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px"
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    cursor: "pointer"
  },
  answerBox: {
    marginTop: "20px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "6px"
  }
};

export default CareerChatbot;
