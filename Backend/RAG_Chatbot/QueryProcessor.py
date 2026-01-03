from embedder import embed_user_query
from vector_store import search_in_pinecone
from llm import query_llm_with_context


def process_user_query(query: str) -> str:
    # 1️⃣ Validate input
    if not query or not query.strip():
        return "Please ask a valid HR-related question."

    # 2️⃣ Embed the user's query
    query_vector = embed_user_query(query)

    # 3️⃣ Search the vector DB
    matched_chunks = search_in_pinecone(query_vector, top_k=4)

    # 4️⃣ Handle no relevant matches
    if not matched_chunks:
        return "I cannot find relevant information for this question in the HR policies."

    # 5️⃣ Convert list of chunks → single context string
    context = "\n\n".join(matched_chunks)

    # 6️⃣ Generate response using LLM
    generated_response = query_llm_with_context(query, context)

    # 7️⃣ Safety fallback
    if not generated_response:
        return "Unable to generate a response at the moment. Please try again."

    return generated_response


if __name__ == "__main__":
    user_query = "What is the work timing policy?"
    print(process_user_query(user_query))
