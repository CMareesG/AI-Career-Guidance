from langchain_community.llms import Ollama

# Initialize LLaMA-3 via Ollama (local)
llm = Ollama(
    model="llama3",
    temperature=0.4
)

def query_llm_with_context(query: str, context: str) -> str:
    """
    Generate an answer using LLaMA-3 strictly based on retrieved context.
    """

    system_content = """
    If the context does not contain enough information, clearly say:
    "I cannot answer this based on the available information."

Your response must be clear, student-friendly, and structured.
"""

    prompt = f"""
{system_content}

Context:
{context}

Student Question:
{query}

Answer:
"""

    response = llm.invoke(prompt)
    return response.strip()
