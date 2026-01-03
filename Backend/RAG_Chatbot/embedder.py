from sentence_transformers import SentenceTransformer
from typing import List

# Load embedding model (runs locally)
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(EMBEDDING_MODEL_NAME)


def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Embed text chunks using open-source SentenceTransformer model.
    """
    embeddings = model.encode(
        chunks,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    return embeddings.tolist()


def embed_user_query(query: str) -> List[float]:
    """
    Embed a user query using the same embedding model.
    """
    embedding = model.encode(
        query,
        convert_to_numpy=True,
        normalize_embeddings=True
    )
    return embedding.tolist()
