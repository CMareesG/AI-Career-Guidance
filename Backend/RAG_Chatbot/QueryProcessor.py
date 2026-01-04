from embedder import embed_user_query
from vector_store import search_in_pinecone
from llm import query_llm_with_context


# Simple conversational intents
GREETINGS = [
    "hi", "hello", "hey",
    "thanks", "thank you",
    "ok", "okay", "cool",
    "nice", "great", "good",
    "awesome", "fine", "got it"
]


def is_greeting(query: str) -> bool:
    q = query.lower().strip()
    return any(q == g or q.startswith(g) for g in GREETINGS)


def process_user_query(query: str) -> str:
    # 1️⃣ Validate input
    if not query or not query.strip():
        return "Please ask a valid career-related question."

    # 2️⃣ Handle greetings / acknowledgements FIRST
    if is_greeting(query):
        return "You're welcome 🙂 Feel free to ask any career-related questions!"

    # 3️⃣ Embed the user's query
    query_vector = embed_user_query(query)

    # 4️⃣ Search the vector DB
    matched_chunks = search_in_pinecone(query_vector, top_k=4)

    # 5️⃣ Handle no relevant matches
    if not matched_chunks:
        return (
            "I can help with career guidance such as qualifications, skills, "
            "roadmaps, and job roles. Please ask a related question."
        )

    # 6️⃣ Convert list of chunks → single context string
    context = "\n\n".join(matched_chunks)

    # 7️⃣ Generate response using LLM
    generated_response = query_llm_with_context(query, context)

    # 8️⃣ Safety fallback
    if not generated_response:
        return "Unable to generate a response at the moment. Please try again."

    return generated_response
